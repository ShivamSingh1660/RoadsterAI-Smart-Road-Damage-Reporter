import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  ArrowRight,
  Trash2,
  X,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import { loadReports, updateReport, deleteReport } from '../store';
import { useToast } from '../components/Toast';
import type { Report, Category, Severity, Status } from '../types';

const categories: Category[] = ['Pothole', 'Road Crack', 'Surface Damage', 'Waterlogging', 'Other'];
const severities: Severity[] = ['Critical', 'High', 'Medium', 'Low'];
const statuses: Status[] = ['Submitted', 'Under Review', 'In Progress', 'Resolved'];

const severityBadgeStyles: Record<Severity, string> = {
  Critical: 'bg-[#FFEBEE] text-[#D32F2F] border-[#FFCDD2]',
  High: 'bg-[#FFF3E0] text-[#D9531E] border-[#FFCC80]',
  Medium: 'bg-[#FFF8E1] text-[#B7791F] border-[#FFE082]',
  Low: 'bg-[#E8F5E9] text-[#1B7837] border-[#C8E6C9]',
};

const statusBadgeStyles: Record<Status, string> = {
  'Under Review': 'bg-[#FEF3E2] text-[#B86E12] border-[#FCE4BE]',
  'In Progress': 'bg-[#E3F2FD] text-[#1976D2] border-[#BBDEFB]',
  Submitted: 'bg-[#EDE7F6] text-[#5E35B1] border-[#D1C4E9]',
  Resolved: 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]',
};

export default function MyReports() {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  const [reports, setReports] = useState<Report[]>(() => loadReports());
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | ''>('');
  const [severityFilter, setSeverityFilter] = useState<Severity | ''>('');
  const [statusFilter, setStatusFilter] = useState<Status | ''>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'severity'>('newest');

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Read URL query params on mount
  useEffect(() => {
    const q = searchParams.get('q');
    const sev = searchParams.get('severity');
    if (q) setSearch(q);
    if (sev && ['Critical', 'High', 'Medium', 'Low'].includes(sev)) {
      setSeverityFilter(sev as Severity);
    }
  }, [searchParams]);

  const filteredReports = useMemo(() => {
    let list = [...reports];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
      );
    }

    if (categoryFilter) list = list.filter((r) => r.category === categoryFilter);
    if (severityFilter) list = list.filter((r) => r.severity === severityFilter);
    if (statusFilter) list = list.filter((r) => r.status === statusFilter);

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'severity') {
        const order: Record<Severity, number> = { Critical: 3, High: 2, Medium: 1, Low: 0 };
        return order[b.severity] - order[a.severity];
      }
      return 0;
    });

    return list;
  }, [reports, search, categoryFilter, severityFilter, statusFilter, sortBy]);

  const handleStatusUpdate = (id: string, newStatus: Status) => {
    const updated = updateReport(id, { status: newStatus });
    setReports(updated);
    if (selectedReport?.id === id) {
      setSelectedReport({ ...selectedReport, status: newStatus });
    }
    showToast(`Status updated to "${newStatus}"`, 'success');
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    const updated = deleteReport(deleteId);
    setReports(updated);
    if (selectedReport?.id === deleteId) setSelectedReport(null);
    setDeleteId(null);
    showToast('Report deleted successfully', 'info');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#15221B]">
          My Reports
        </h1>
        <p className="text-sm text-[#5C6E63] mt-0.5">
          Track and manage all your reported road issues.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-[#E2E6DC] shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8B80]" />
          <input
            type="text"
            placeholder="Search by ID, location or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#F8F9F5] border border-[#E2E6DC] text-xs text-[#15221B] placeholder:text-[#8B9C92] focus:outline-none focus:border-[#0E382B]"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as Category | '')}
            className="px-3 py-1.5 rounded-xl bg-[#F8F9F5] border border-[#E2E6DC] text-xs text-[#15221B] focus:outline-none focus:border-[#0E382B]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as Severity | '')}
            className="px-3 py-1.5 rounded-xl bg-[#F8F9F5] border border-[#E2E6DC] text-xs text-[#15221B] focus:outline-none focus:border-[#0E382B]"
          >
            <option value="">All Severities</option>
            {severities.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | '')}
            className="px-3 py-1.5 rounded-xl bg-[#F8F9F5] border border-[#E2E6DC] text-xs text-[#15221B] focus:outline-none focus:border-[#0E382B]"
          >
            <option value="">All Statuses</option>
            {statuses.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-[#F8F9F5] border border-[#E2E6DC] text-xs text-[#15221B] font-medium focus:outline-none focus:border-[#0E382B]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="severity">Highest Severity</option>
          </select>
        </div>
      </div>

      {/* Reports Table Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E6DC] shadow-xs">
        {filteredReports.length === 0 ? (
          <div className="py-12 text-center text-[#7A8B80]">
            <p className="text-sm font-semibold">No reports match your filters.</p>
            <p className="text-xs mt-1">Try resetting the search or category filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E6DC] text-[11px] font-semibold text-[#7A8B80] uppercase tracking-wider">
                  <th className="pb-3 pl-2">Image</th>
                  <th className="pb-3">Report Details</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Severity</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF1EA] text-xs">
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className="hover:bg-[#F9FAF6] transition-colors cursor-pointer group"
                  >
                    {/* Thumbnail */}
                    <td className="py-3 pl-2">
                      <div className="w-12 h-10 rounded-lg overflow-hidden bg-stone-100 border border-[#E2E6DC] shrink-0">
                        <img
                          src={report.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=150&q=80'}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Report Details (ID, Title, Location) */}
                    <td className="py-3 pr-4 max-w-[280px]">
                      <p className="font-mono text-[11px] font-bold text-[#15221B]">{report.id}</p>
                      <p className="text-[11px] text-[#55655C] truncate mt-0.5">{report.location}</p>
                      <p className="text-[10px] text-[#88998F] truncate">{report.title}</p>
                    </td>

                    {/* Category */}
                    <td className="py-3 text-[#4A5B52] font-medium">
                      {report.category}
                    </td>

                    {/* Severity */}
                    <td className="py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${severityBadgeStyles[report.severity]}`}>
                        {report.severity}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-block">
                        <select
                          value={report.status}
                          onChange={(e) => handleStatusUpdate(report.id, e.target.value as Status)}
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border cursor-pointer appearance-none pr-5 focus:outline-none ${statusBadgeStyles[report.status]}`}
                        >
                          {statuses.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                        <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3 text-[#7A8B80] text-[11px] whitespace-nowrap">
                      {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>

                    {/* Action */}
                    <td className="py-3 text-right pr-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="p-1.5 rounded-lg text-[#7A8B80] hover:text-[#0E382B] hover:bg-[#E8F4D9] transition-colors"
                          title="View Details"
                        >
                          <ArrowRight size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(report.id)}
                          className="p-1.5 rounded-lg text-[#7A8B80] hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-white rounded-3xl border border-[#E2E6DC] p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E6DC]">
              <div>
                <h3 className="text-base font-bold text-[#15221B]">Report Details</h3>
                <p className="text-xs font-mono text-[#7A8B80]">{selectedReport.id}</p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-lg text-[#7A8B80] hover:text-[#15221B] hover:bg-[#F2F3EC]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden h-48 bg-stone-900 border border-[#E2E6DC]">
              <img
                src={selectedReport.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h4 className="text-base font-bold text-[#15221B]">{selectedReport.title}</h4>
              <p className="text-xs text-[#55655C] mt-1 leading-relaxed">{selectedReport.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#F8F9F5] border border-[#E2E6DC] text-xs">
              <div>
                <span className="text-[#7A8B80] block text-[10px] uppercase">Category</span>
                <span className="font-semibold text-[#15221B]">{selectedReport.category}</span>
              </div>
              <div>
                <span className="text-[#7A8B80] block text-[10px] uppercase">Severity</span>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${severityBadgeStyles[selectedReport.severity]}`}>
                  {selectedReport.severity}
                </span>
              </div>
              <div>
                <span className="text-[#7A8B80] block text-[10px] uppercase">Status</span>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadgeStyles[selectedReport.status]}`}>
                  {selectedReport.status}
                </span>
              </div>
              <div>
                <span className="text-[#7A8B80] block text-[10px] uppercase">Location</span>
                <span className="text-[#15221B] truncate block">{selectedReport.location}</span>
              </div>
            </div>

            {selectedReport.recommendedAction && (
              <div className="p-3 rounded-xl bg-[#E8F4D9]/60 border border-[#D2E4BE]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A20] mb-0.5">
                  Recommended Action
                </p>
                <p className="text-xs text-[#15221B]">{selectedReport.recommendedAction}</p>
              </div>
            )}

            <div className="pt-2">
              <label className="text-xs font-bold text-[#15221B] block mb-1">Update Status</label>
              <select
                value={selectedReport.status}
                onChange={(e) => handleStatusUpdate(selectedReport.id, e.target.value as Status)}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F9F5] border border-[#E2E6DC] text-xs text-[#15221B] focus:outline-none focus:border-[#0E382B]"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedReport(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#0E382B] text-white text-xs font-semibold hover:bg-[#154E3A]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setDeleteId(selectedReport.id);
                  setSelectedReport(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E6DC] p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#15221B]">Delete Incident Report?</h3>
            <p className="text-xs text-[#55655C]">
              Are you sure you want to delete report <span className="font-mono font-bold text-[#0E382B]">{deleteId}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-xl bg-[#F4F5EF] text-xs font-semibold text-[#15221B] hover:bg-[#EAECE3]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
