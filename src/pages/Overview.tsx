import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  MapPin,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { loadReports } from '../store';
import type { Report, Severity, Status } from '../types';

const categoryColors: Record<string, string> = {
  Pothole: '#0E382B',
  'Road Crack': '#E06B26',
  'Surface Damage': '#2A7B9B',
  Waterlogging: '#7B52A6',
  Other: '#A6B5A4',
};

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

const trendData = [
  { day: 'Oct 16', reports: 4 },
  { day: 'Oct 17', reports: 7 },
  { day: 'Oct 18', reports: 6 },
  { day: 'Oct 19', reports: 11 },
  { day: 'Oct 20', reports: 14 },
  { day: 'Oct 21', reports: 18 },
  { day: 'Oct 22', reports: 24 },
];

export default function Overview() {
  const navigate = useNavigate();
  const reports = useMemo(() => loadReports(), []);

  const totalReports = reports.length;
  const criticalCount = reports.filter((r) => r.severity === 'Critical' && r.status !== 'Resolved').length;
  const awaitingReview = reports.filter((r) => r.status === 'Under Review').length;
  const resolvedCount = reports.filter((r) => r.status === 'Resolved').length;

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    const total = reports.length || 1;
    return Object.entries(counts).map(([name, count]) => ({
      name,
      value: count,
      percent: Math.round((count / total) * 100),
      color: categoryColors[name] || '#88998F',
    }));
  }, [reports]);

  const featured = reports.find((r) => r.id === 'RPT-2026-0012') || reports[0];

  const priorityAlerts = useMemo(() => {
    return reports
      .filter((r) => r.severity === 'Critical' || r.severity === 'High')
      .slice(0, 3);
  }, [reports]);

  const recentReports = reports.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Title & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#15221B]">
            Urban Intelligence.
          </h1>
          <p className="text-sm text-[#5C6E63] mt-1 font-medium">
            See the road issues that need attention.
          </p>
        </div>
        <button
          onClick={() => navigate('/report')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0E382B] hover:bg-[#154E3A] active:bg-[#0A2B20] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 shrink-0"
        >
          <Plus size={16} />
          Report Damage
        </button>
      </div>

      {/* Hero Asymmetric Section: Featured Road-Inspection + Infrastructure Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E6DC] shadow-xs items-center">
        {/* Left: Road Photography Card with overlay detections */}
        <div className="lg:col-span-7 relative rounded-2xl overflow-hidden h-[300px] sm:h-[340px] bg-stone-900 group border border-[#E2E6DC]">
          <img
            src="/road_pothole.jpg"
            alt="Road surface inspection"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

          {/* Top Overlaid Detection Pill */}
          <div className="absolute top-4 right-4 sm:right-6 bg-black/70 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2.5 shadow-xl flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D32F2F] animate-ping shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">Pothole Detected</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#D32F2F] text-white">Critical</span>
              </div>
              <p className="text-[10px] text-stone-300 font-medium mt-0.5">Confidence {featured?.confidence || 87.4}%</p>
            </div>
          </div>

          {/* Bottom Overlaid Location Bar */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10">
              <MapPin size={14} className="text-[#C8F169]" />
              <span className="text-xs font-semibold tracking-wide drop-shadow-sm">
                {featured?.location || 'Hazratganj Road, Lucknow'}
              </span>
            </div>
            <span className="text-[11px] text-stone-300 bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-xs font-medium hidden sm:inline-block">
              Sector 4 Camera
            </span>
          </div>
        </div>

        {/* Right: Infrastructure Watch Details */}
        <div className="lg:col-span-5 flex flex-col justify-between p-2 sm:p-4 h-full">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold tracking-wider uppercase text-[#7A8B80]">
                Infrastructure Watch
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFEBEE] text-[#D32F2F] border border-[#FFCDD2]">
                Critical Issue
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#15221B] leading-snug mt-1">
              {featured?.title || 'Large pothole on Hazratganj Road'}
            </h2>

            <div className="flex items-center gap-1.5 text-xs text-[#5C6E63] font-medium mt-1.5 mb-5">
              <MapPin size={13} className="text-[#0E382B]" />
              <span>{featured?.location || 'Hazratganj Road, Lucknow'}</span>
            </div>

            {/* 3-Column Attributes Grid with neat background */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F8F9F5] border border-[#E2E6DC] mb-5">
              <div>
                <p className="text-[10px] font-bold text-[#7A8B80] uppercase tracking-wider">Category</p>
                <p className="text-xs font-extrabold text-[#15221B] mt-1">{featured?.category}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#7A8B80] uppercase tracking-wider">Severity</p>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${severityBadgeStyles[featured?.severity || 'Critical']}`}>
                  {featured?.severity}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#7A8B80] uppercase tracking-wider">Status</p>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadgeStyles[featured?.status || 'Under Review']}`}>
                  {featured?.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#52635A] leading-relaxed mb-6 font-normal">
              {featured?.description || 'This section needs immediate attention due to high traffic and safety risk.'}
            </p>
          </div>

          <button
            onClick={() => navigate('/my-reports')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0E382B] text-white text-xs font-bold hover:bg-[#154E3A] transition-all shadow-xs self-start"
          >
            Inspect Report
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Row 2: 4 Infrastructure Metric Cards (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Reports */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E6DC] shadow-xs flex items-center justify-between hover:shadow-md hover:border-[#CCD5C5] transition-all">
          <div>
            <p className="text-xs font-semibold text-[#65766D]">Total Reports</p>
            <div className="flex items-baseline gap-2.5 mt-1.5">
              <span className="text-3xl font-extrabold text-[#15221B] tracking-tight">{totalReports}</span>
              <span className="inline-flex items-center text-[10px] font-bold text-[#2D5A20] bg-[#E8F4D9] px-2.5 py-0.5 rounded-full border border-[#D2E4BE]">
                ↑ 33%
              </span>
            </div>
            <p className="text-[11px] text-[#8A9A90] mt-1 font-medium">vs last 7 days</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8F4D9] flex items-center justify-center text-[#2D5A20] shrink-0">
            <FileText size={22} />
          </div>
        </div>

        {/* Critical Issues */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E6DC] shadow-xs flex items-center justify-between hover:shadow-md hover:border-[#CCD5C5] transition-all">
          <div>
            <p className="text-xs font-semibold text-[#65766D]">Critical Issues</p>
            <div className="flex items-baseline gap-2.5 mt-1.5">
              <span className="text-3xl font-extrabold text-[#15221B] tracking-tight">{criticalCount}</span>
              <span className="inline-flex items-center text-[10px] font-bold text-[#D32F2F] bg-[#FFEBEE] px-2.5 py-0.5 rounded-full border border-[#FFCDD2]">
                ! 67%
              </span>
            </div>
            <p className="text-[11px] text-[#8A9A90] mt-1 font-medium">vs last 7 days</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FFEBEE] flex items-center justify-center text-[#D32F2F] shrink-0">
            <AlertTriangle size={22} />
          </div>
        </div>

        {/* Awaiting Review */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E6DC] shadow-xs flex items-center justify-between hover:shadow-md hover:border-[#CCD5C5] transition-all">
          <div>
            <p className="text-xs font-semibold text-[#65766D]">Awaiting Review</p>
            <div className="flex items-baseline gap-2.5 mt-1.5">
              <span className="text-3xl font-extrabold text-[#15221B] tracking-tight">{awaitingReview}</span>
              <span className="inline-flex items-center text-[10px] font-bold text-[#B86E12] bg-[#FEF3E2] px-2.5 py-0.5 rounded-full border border-[#FCE4BE]">
                ~ 33%
              </span>
            </div>
            <p className="text-[11px] text-[#8A9A90] mt-1 font-medium">vs last 7 days</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FEF3E2] flex items-center justify-center text-[#B86E12] shrink-0">
            <Clock size={22} />
          </div>
        </div>

        {/* Resolved Issues */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E6DC] shadow-xs flex items-center justify-between hover:shadow-md hover:border-[#CCD5C5] transition-all">
          <div>
            <p className="text-xs font-semibold text-[#65766D]">Resolved Issues</p>
            <div className="flex items-baseline gap-2.5 mt-1.5">
              <span className="text-3xl font-extrabold text-[#15221B] tracking-tight">{resolvedCount}</span>
              <span className="inline-flex items-center text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full border border-[#C8E6C9]">
                ↑ 25%
              </span>
            </div>
            <p className="text-[11px] text-[#8A9A90] mt-1 font-medium">vs last 7 days</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] shrink-0">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Row 3: 3 Columns Grid (Report Trend, Damage Categories, Priority Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Report Trend */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2E6DC] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-[#15221B]">Report Trend</h3>
            <span className="text-[11px] font-bold text-[#6A7B72] bg-[#F4F5EF] px-3 py-1 rounded-lg border border-[#E2E6DC]">
              Last 7 days ▼
            </span>
          </div>
          <div className="h-48 w-full min-h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82A769" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#82A769" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#7C8C83', fontSize: 10 }}
                  axisLine={{ stroke: '#E2E6DC' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#7C8C83', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={22}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E6DC',
                    fontSize: '11px',
                    color: '#15221B',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="reports"
                  stroke="#4E7B44"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#trendGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Column 2: Damage Categories Donut */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2E6DC] shadow-xs">
          <h3 className="text-sm font-extrabold text-[#15221B] mb-3">Damage Categories</h3>
          <div className="flex items-center h-48">
            <div className="w-1/2 h-full min-h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '10px',
                      border: '1px solid #E2E6DC',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-2 pl-3">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[#55655C] truncate text-[11px] font-medium">{item.name}</span>
                  </div>
                  <span className="font-extrabold text-[#15221B] text-[11px] shrink-0 ml-1">
                    {item.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Priority Alerts (Clear separate indicator bar without text collision) */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2E6DC] shadow-xs flex flex-col justify-between">
          <h3 className="text-sm font-extrabold text-[#15221B] mb-3">Priority Alerts</h3>
          <div className="space-y-3 flex-1">
            {priorityAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => navigate('/my-reports')}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8F9F5] hover:bg-[#F0F2EB] border border-[#E2E6DC] transition-all cursor-pointer shadow-2xs group"
              >
                <span
                  className="w-1.5 h-9 rounded-full shrink-0"
                  style={{
                    backgroundColor: alert.severity === 'Critical' ? '#D32F2F' : alert.severity === 'High' ? '#E06B26' : '#C28416',
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#15221B] truncate group-hover:text-[#0E382B] transition-colors">
                    {alert.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                    <span className={`font-bold ${alert.severity === 'Critical' ? 'text-[#D32F2F]' : 'text-[#D9531E]'}`}>
                      {alert.severity}
                    </span>
                    <span className="text-[#88998F]">·</span>
                    <span className="text-[#5C6E63] truncate font-medium">{alert.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Recent Reports Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E6DC] shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-extrabold text-[#15221B]">Recent Reports</h3>
          <button
            onClick={() => navigate('/my-reports')}
            className="text-xs font-bold text-[#0E382B] hover:text-[#185340] inline-flex items-center gap-1.5 transition-colors group"
          >
            View all
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E6DC] text-[11px] font-bold text-[#7A8B80] uppercase tracking-wider">
                <th className="pb-3.5 pl-2">Image</th>
                <th className="pb-3.5">Title & Location</th>
                <th className="pb-3.5">Category</th>
                <th className="pb-3.5">Severity</th>
                <th className="pb-3.5">Status</th>
                <th className="pb-3.5">Date</th>
                <th className="pb-3.5 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDF1EA] text-xs">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-[#F9FAF6] transition-colors group">
                  {/* Thumbnail */}
                  <td className="py-3.5 pl-2">
                    <div className="w-12 h-10 rounded-lg overflow-hidden bg-stone-100 border border-[#E2E6DC] shrink-0">
                      <img
                        src={report.imageUrl || '/road_pothole.jpg'}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  {/* Title & Location */}
                  <td className="py-3.5 pr-4 max-w-[280px]">
                    <p className="font-bold text-[#15221B] truncate">{report.title}</p>
                    <p className="text-[11px] text-[#7A8B80] truncate mt-0.5 font-medium">{report.location}</p>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 text-[#4A5B52] font-semibold">
                    {report.category}
                  </td>

                  {/* Severity */}
                  <td className="py-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${severityBadgeStyles[report.severity]}`}>
                      {report.severity}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadgeStyles[report.status]}`}>
                      {report.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 text-[#7A8B80] text-[11px] font-medium whitespace-nowrap">
                    {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 text-right pr-2">
                    <button
                      onClick={() => navigate('/my-reports')}
                      className="p-1.5 rounded-lg text-[#7A8B80] hover:text-[#0E382B] hover:bg-[#E8F4D9] transition-all"
                      aria-label={`View report ${report.id}`}
                    >
                      <ArrowRight size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
