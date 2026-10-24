import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {
  Search,
  Filter,
  MapPin,
  X,
  ArrowRight,
  ExternalLink,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { loadReports, updateReport } from '../store';
import { useToast } from '../components/Toast';
import type { Report, Severity, Category, Status } from '../types';

// Colored marker icons matching the reference
function createMarkerIcon(severity: Severity, isSelected: boolean): L.DivIcon {
  const colors: Record<Severity, string> = {
    Critical: '#D32F2F',
    High: '#E06B26',
    Medium: '#C28416',
    Low: '#1B7837',
  };
  const color = colors[severity];
  const size = isSelected ? 34 : 26;
  const dotSize = isSelected ? 10 : 8;

  return L.divIcon({
    className: 'custom-road-marker',
    html: `<div style="
      width: ${size}px; height: ${size}px; border-radius: 50%;
      background: ${color}; border: 3px solid #FFFFFF;
      box-shadow: 0 4px 12px ${color}66, 0 1px 3px rgba(0,0,0,0.2);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    "><div style="width: ${dotSize}px; height: ${dotSize}px; border-radius: 50%; background: #FFFFFF;"></div></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
  });
}

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

const categories: Category[] = ['Pothole', 'Road Crack', 'Surface Damage', 'Waterlogging', 'Other'];
const severities: Severity[] = ['Critical', 'High', 'Medium', 'Low'];
const statuses: Status[] = ['Submitted', 'Under Review', 'In Progress', 'Resolved'];

export default function MapPage() {
  const { showToast } = useToast();
  const [reports, setReports] = useState<Report[]>(() => loadReports());
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>('');
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<Status | ''>('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(() => {
    const list = loadReports();
    return list.find((r) => r.id === 'RPT-2026-0012') || list[0] || null;
  });
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [mapError, setMapError] = useState(false);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (!r.latitude || !r.longitude) return false;
      if (search) {
        const q = search.toLowerCase();
        const matches =
          r.title.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (selectedCategory && r.category !== selectedCategory) return false;
      if (selectedSeverity && r.severity !== selectedSeverity) return false;
      if (selectedStatus && r.status !== selectedStatus) return false;
      return true;
    });
  }, [reports, search, selectedCategory, selectedSeverity, selectedStatus]);

  const handleStatusChange = (id: string, newStatus: Status) => {
    const updated = updateReport(id, { status: newStatus });
    setReports(updated);
    if (selectedReport?.id === id) {
      setSelectedReport({ ...selectedReport, status: newStatus });
    }
    showToast(`Status updated to "${newStatus}"`, 'success');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#15221B]">
          Road Damage Map
        </h1>
        <p className="text-sm text-[#5C6E63] mt-0.5">
          Explore reported road issues across the city.
        </p>
      </div>

      {/* Filter and Legend Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-[#E2E6DC] shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Left Inputs */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Location */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8B80]" />
            <input
              type="text"
              placeholder="Search location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#F8F9F5] border border-[#E2E6DC] text-xs text-[#15221B] placeholder:text-[#8B9C92] focus:outline-none focus:border-[#0E382B]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Category | '')}
            className="px-3 py-1.5 rounded-xl bg-[#F8F9F5] border border-[#E2E6DC] text-xs text-[#15221B] focus:outline-none focus:border-[#0E382B]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value as Severity | '')}
            className="px-3 py-1.5 rounded-xl bg-[#F8F9F5] border border-[#E2E6DC] text-xs text-[#15221B] focus:outline-none focus:border-[#0E382B]"
          >
            <option value="">All Severities</option>
            {severities.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as Status | '')}
            className="px-3 py-1.5 rounded-xl bg-[#F8F9F5] border border-[#E2E6DC] text-xs text-[#15221B] focus:outline-none focus:border-[#0E382B]"
          >
            <option value="">All Statuses</option>
            {statuses.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Right Legend Pills */}
        <div className="flex items-center gap-3 shrink-0 self-start lg:self-auto text-xs text-[#55655C]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D32F2F]" />
            <span className="text-[11px] font-medium">Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E06B26]" />
            <span className="text-[11px] font-medium">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C28416]" />
            <span className="text-[11px] font-medium">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1B7837]" />
            <span className="text-[11px] font-medium">Low</span>
          </div>
        </div>
      </div>

      {/* Map Layout with Side Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative">
        {/* Map Canvas */}
        <div
          className={`${
            selectedReport ? 'lg:col-span-8 xl:col-span-8' : 'lg:col-span-12'
          } rounded-3xl overflow-hidden border border-[#E2E6DC] shadow-xs relative bg-white transition-all`}
          style={{ height: 'calc(100vh - 270px)', minHeight: '460px' }}
        >
          {mapError ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <MapPin size={40} className="text-[#88998F] mb-3" />
              <h3 className="text-base font-bold text-[#15221B]">Map Offline Mode</h3>
              <p className="text-xs text-[#5C6E63] max-w-sm mt-1">
                Showing offline incident coordinates. All {filteredReports.length} reports are active.
              </p>
            </div>
          ) : (
            <MapContainer
              center={[26.8500, 80.9500]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              {/* CartoDB Positron: Beautiful light off-white tiles */}
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                eventHandlers={{
                  tileerror: () => setMapError(false), // keep graceful
                }}
              />

              {filteredReports.map((report) => (
                <Marker
                  key={report.id}
                  position={[report.latitude!, report.longitude!]}
                  icon={createMarkerIcon(report.severity, selectedReport?.id === report.id)}
                  eventHandlers={{
                    click: () => {
                      setSelectedReport(report);
                    },
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[210px] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${severityBadgeStyles[report.severity]}`}>
                          {report.severity}
                        </span>
                        <span className="text-[10px] font-mono text-[#7A8B80]">{report.id}</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#15221B] leading-tight">{report.title}</h4>
                      <p className="text-[11px] text-[#55655C] flex items-center gap-1">
                        <MapPin size={11} className="text-[#0E382B]" />
                        {report.location}
                      </p>
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="w-full mt-1 py-1 px-2 rounded-lg bg-[#0E382B] text-white text-[10px] font-semibold flex items-center justify-center gap-1"
                      >
                        View Details →
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}

          {/* Floating Markers Counter */}
          <div className="absolute bottom-4 left-4 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E2E6DC] text-xs font-medium text-[#15221B] shadow-sm">
            Showing <span className="font-bold text-[#0E382B]">{filteredReports.length}</span> reports on map
          </div>
        </div>

        {/* Selected Report Side Card (Matches Reference Image Screen 3) */}
        {selectedReport && (
          <div className="lg:col-span-4 xl:col-span-4 bg-white rounded-3xl p-5 border border-[#E2E6DC] shadow-xs flex flex-col justify-between space-y-4 animate-fade-in">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A8B80]">
                  Selected Report
                </span>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-1 rounded-lg text-[#7A8B80] hover:text-[#15221B] hover:bg-[#F2F3EC] transition-colors"
                  aria-label="Close report panel"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Photo Image */}
              <div className="relative rounded-2xl overflow-hidden h-40 bg-stone-900 border border-[#E2E6DC] mb-3">
                <img
                  src={selectedReport.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'}
                  alt={selectedReport.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & ID */}
              <h3 className="text-base font-bold text-[#15221B] leading-tight">
                {selectedReport.title}
              </h3>
              <p className="text-[11px] font-mono text-[#7A8B80] mt-0.5">
                ID: {selectedReport.id}
              </p>

              {/* Grid Metadata */}
              <div className="grid grid-cols-2 gap-3 my-3 p-3 rounded-xl bg-[#F8F9F5] border border-[#E2E6DC]">
                <div>
                  <span className="text-[10px] text-[#7A8B80] uppercase tracking-wider block">Category</span>
                  <span className="text-xs font-bold text-[#15221B] mt-0.5 block">{selectedReport.category}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A8B80] uppercase tracking-wider block">Severity</span>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold border ${severityBadgeStyles[selectedReport.severity]}`}>
                    {selectedReport.severity}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A8B80] uppercase tracking-wider block">Status</span>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadgeStyles[selectedReport.status]}`}>
                    {selectedReport.status}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A8B80] uppercase tracking-wider block">Confidence</span>
                  <span className="text-xs font-bold text-[#2D5A20] mt-0.5 block">
                    {selectedReport.confidence || 87.4}%
                  </span>
                </div>
              </div>

              {/* Location & Date */}
              <div className="space-y-1.5 text-xs text-[#55655C]">
                <div className="flex items-start gap-1.5">
                  <MapPin size={13} className="text-[#0E382B] shrink-0 mt-0.5" />
                  <span>{selectedReport.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#7A8B80]">
                  <Clock size={12} className="shrink-0" />
                  <span>
                    {new Date(selectedReport.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Quick status updater */}
              <div className="mt-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A8B80] block mb-1">
                  Change Status
                </label>
                <select
                  value={selectedReport.status}
                  onChange={(e) => handleStatusChange(selectedReport.id, e.target.value as Status)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#F8F9F5] border border-[#E2E6DC] text-xs text-[#15221B] focus:outline-none focus:border-[#0E382B]"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => setDetailModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0E382B] text-white text-xs font-semibold hover:bg-[#154E3A] transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              View Full Details
              <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Full Detail Modal */}
      {detailModalOpen && selectedReport && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setDetailModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl border border-[#E2E6DC] p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E6DC]">
              <div>
                <h3 className="text-base font-bold text-[#15221B]">Incident Record</h3>
                <p className="text-xs font-mono text-[#7A8B80]">{selectedReport.id}</p>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-1 rounded-lg text-[#7A8B80] hover:text-[#15221B] hover:bg-[#F2F3EC]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden h-48 bg-stone-900 border border-[#E2E6DC]">
              <img
                src={selectedReport.imageUrl}
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
                <span className="text-[#7A8B80] block text-[10px] uppercase">Coordinates</span>
                <span className="font-mono text-[#15221B]">
                  {selectedReport.latitude?.toFixed(4)}, {selectedReport.longitude?.toFixed(4)}
                </span>
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

            <button
              onClick={() => setDetailModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#0E382B] text-white text-xs font-semibold hover:bg-[#154E3A]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
