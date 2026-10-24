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
  ChevronRight,
  Calendar,
  Layers,
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
  Other: '#8FA396',
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
      color: categoryColors[name] || '#8FA396',
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
    <div className="flex flex-col gap-9 pb-12 animate-fade-in">
      {/* Page Title & Main Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#11231B]">
              Urban Intelligence
            </h1>
            <span className="w-2.5 h-2.5 rounded-full bg-[#0E382B] inline-block mb-1" />
          </div>
          <p className="text-sm text-[#55675C] mt-1 font-medium">
            Live municipal road inspection feed and automated hazard prioritization.
          </p>
        </div>
        <button
          onClick={() => navigate('/report')}
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#0E382B] hover:bg-[#154E3A] active:bg-[#0A2B20] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 shrink-0 cursor-pointer"
        >
          <Plus size={17} />
          Report Road Damage
        </button>
      </div>

      {/* Hero Section: Featured Road-Inspection + Infrastructure Watch */}
      <div className="saas-card p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Road Photography Card with overlay detections */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden min-h-[320px] sm:min-h-[360px] bg-stone-900 group border border-[#D5DDCF] shadow-inner">
            <img
              src="/road_pothole.jpg"
              alt="Road surface inspection"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 pointer-events-none" />

            {/* Top Overlaid Detection Pill */}
            <div className="absolute top-4 right-4 sm:right-6 bg-black/75 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2.5 shadow-xl flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D32F2F] animate-ping shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white tracking-wide">Pothole Detected</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D32F2F] text-white">Critical</span>
                </div>
                <p className="text-[10px] text-stone-300 font-medium mt-0.5">Confidence {featured?.confidence || 87.4}% · Sensor #4</p>
              </div>
            </div>

            {/* Bottom Overlaid Location Bar */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2 bg-black/65 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/15">
                <MapPin size={15} className="text-[#C8F169]" />
                <span className="text-xs font-semibold tracking-wide drop-shadow-sm">
                  {featured?.location || 'Hazratganj Road, Lucknow'}
                </span>
              </div>
              <span className="text-[11px] text-stone-200 bg-black/60 px-3.5 py-2 rounded-xl backdrop-blur-xs font-semibold hidden sm:inline-block border border-white/10">
                Camera Feed #04
              </span>
            </div>
          </div>

          {/* Right: Infrastructure Watch Details */}
          <div className="lg:col-span-5 flex flex-col justify-between py-1">
            <div>
              {/* Header Badge Row */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-extrabold tracking-wider uppercase text-[#5D7063]">
                  Infrastructure Watch
                </span>
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#FFEBEE] text-[#D32F2F] border border-[#FFCDD2] shadow-2xs">
                  Critical Hazard
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-[26px] font-black text-[#11231B] leading-snug">
                {featured?.title || 'Large pothole on Hazratganj Road'}
              </h2>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-xs text-[#526458] font-medium mt-2 mb-5">
                <MapPin size={14} className="text-[#0E382B]" />
                <span>{featured?.location || 'Hazratganj Road, Lucknow'}</span>
                <span className="text-[#99A89D]">·</span>
                <span>Reported Oct 22, 2026</span>
              </div>

              {/* 3-Column Attributes Grid - Spacious, self-contained, no overflow */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F4F7F0] border border-[#D5DFD0] mb-5">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-[#5A6D60] uppercase tracking-wider block">Category</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#11231B] mt-1 block truncate">
                    {featured?.category}
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-[#5A6D60] uppercase tracking-wider block">Severity</span>
                  <div className="mt-1">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap shadow-2xs ${severityBadgeStyles[featured?.severity || 'Critical']}`}>
                      {featured?.severity}
                    </span>
                  </div>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-[#5A6D60] uppercase tracking-wider block">Status</span>
                  <div className="mt-1">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap shadow-2xs ${statusBadgeStyles[featured?.status || 'Under Review']}`}>
                      {featured?.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#4E6055] leading-relaxed mb-6 font-normal">
                {featured?.description || 'This section needs immediate attention due to high traffic density and safety risk for two-wheelers and buses.'}
              </p>
            </div>

            {/* Bottom Inspect Action */}
            <div className="pt-2">
              <button
                onClick={() => navigate('/my-reports')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0E382B] text-white text-xs font-bold hover:bg-[#154E3A] transition-all shadow-sm cursor-pointer"
              >
                Inspect Full Report
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: 4 Infrastructure Metric Cards (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Reports */}
        <div className="saas-card p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#617367]">Total Reports</p>
            <div className="flex items-baseline gap-2.5 mt-2">
              <span className="text-3xl sm:text-4xl font-black text-[#11231B] tracking-tight">{totalReports}</span>
              <span className="inline-flex items-center text-[11px] font-bold text-[#2D5A20] bg-[#E8F4D9] px-2.5 py-0.5 rounded-full border border-[#D2E4BE]">
                ↑ 33%
              </span>
            </div>
            <p className="text-xs text-[#7B8D82] mt-1.5 font-medium">vs last 7 days</p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-[#E8F4D9] border border-[#D5E6C4] flex items-center justify-center text-[#2D5A20] shrink-0 shadow-2xs">
            <FileText size={24} />
          </div>
        </div>

        {/* Critical Issues */}
        <div className="saas-card p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#617367]">Critical Issues</p>
            <div className="flex items-baseline gap-2.5 mt-2">
              <span className="text-3xl sm:text-4xl font-black text-[#11231B] tracking-tight">{criticalCount}</span>
              <span className="inline-flex items-center text-[11px] font-bold text-[#D32F2F] bg-[#FFEBEE] px-2.5 py-0.5 rounded-full border border-[#FFCDD2]">
                ! 67%
              </span>
            </div>
            <p className="text-xs text-[#7B8D82] mt-1.5 font-medium">high priority repairs</p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-[#FFEBEE] border border-[#FFCDD2] flex items-center justify-center text-[#D32F2F] shrink-0 shadow-2xs">
            <AlertTriangle size={24} />
          </div>
        </div>

        {/* Awaiting Review */}
        <div className="saas-card p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#617367]">Awaiting Review</p>
            <div className="flex items-baseline gap-2.5 mt-2">
              <span className="text-3xl sm:text-4xl font-black text-[#11231B] tracking-tight">{awaitingReview}</span>
              <span className="inline-flex items-center text-[11px] font-bold text-[#B86E12] bg-[#FEF3E2] px-2.5 py-0.5 rounded-full border border-[#FCE4BE]">
                ~ 33%
              </span>
            </div>
            <p className="text-xs text-[#7B8D82] mt-1.5 font-medium">pending verification</p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-[#FEF3E2] border border-[#FCE4BE] flex items-center justify-center text-[#B86E12] shrink-0 shadow-2xs">
            <Clock size={24} />
          </div>
        </div>

        {/* Resolved Issues */}
        <div className="saas-card p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#617367]">Resolved Issues</p>
            <div className="flex items-baseline gap-2.5 mt-2">
              <span className="text-3xl sm:text-4xl font-black text-[#11231B] tracking-tight">{resolvedCount}</span>
              <span className="inline-flex items-center text-[11px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full border border-[#C8E6C9]">
                ↑ 25%
              </span>
            </div>
            <p className="text-xs text-[#7B8D82] mt-1.5 font-medium">fixed this cycle</p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center text-[#2E7D32] shrink-0 shadow-2xs">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      {/* Row 3: 3 Columns Grid (Report Trend, Damage Categories, Priority Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Column 1: Report Trend */}
        <div className="saas-card p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-black text-[#11231B]">Report Trend</h3>
              <span className="text-[11px] font-bold text-[#55675C] bg-[#F2F5ED] px-3 py-1 rounded-lg border border-[#D5DDCF]">
                Last 7 days
              </span>
            </div>
            <p className="text-xs text-[#6C7E73] font-medium mb-4">
              24 total damage incidents reported across Lucknow.
            </p>
          </div>
          <div className="h-52 w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82A769" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#82A769" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#7C8C83', fontSize: 11, fontWeight: 500 }}
                  axisLine={{ stroke: '#DCE4D6' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#7C8C83', fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #CCD4C6',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#11231B',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="reports"
                  stroke="#3E6B34"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#trendGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Column 2: Damage Categories Donut */}
        <div className="saas-card p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-black text-[#11231B]">Damage Categories</h3>
              <span className="text-[11px] font-bold text-[#0E382B] bg-[#E2EFD2] px-2.5 py-0.5 rounded-lg border border-[#C6DCB0]">
                AI Verified
              </span>
            </div>
            <p className="text-xs text-[#6C7E73] font-medium mb-4">
              Automated classification distribution.
            </p>
          </div>
          <div className="flex items-center h-52">
            <div className="w-1/2 h-full min-h-[190px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
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
                      border: '1px solid #CCD4C6',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-2.5 pl-2">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[#526458] truncate text-xs font-semibold">{item.name}</span>
                  </div>
                  <span className="font-extrabold text-[#11231B] text-xs shrink-0 ml-1">
                    {item.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Priority Action Queue */}
        <div className="saas-card p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-black text-[#11231B]">Priority Action Queue</h3>
              <span className="text-[11px] font-bold text-[#D32F2F] bg-[#FFEBEE] px-2.5 py-0.5 rounded-lg border border-[#FFCDD2]">
                3 Action Required
              </span>
            </div>
            <p className="text-xs text-[#6C7E73] font-medium mb-4">
              Severe road hazards needing emergency dispatch.
            </p>
          </div>

          <div className="space-y-3 flex-1">
            {priorityAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => navigate('/my-reports')}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F8FAF5] hover:bg-[#EEF3E7] border border-[#DCE4D6] hover:border-[#CCD5C5] transition-all cursor-pointer shadow-2xs group"
              >
                <span
                  className="w-1.5 h-10 rounded-full shrink-0"
                  style={{
                    backgroundColor: alert.severity === 'Critical' ? '#D32F2F' : alert.severity === 'High' ? '#E06B26' : '#C28416',
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#11231B] truncate group-hover:text-[#0E382B] transition-colors">
                    {alert.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px]">
                    <span className={`font-bold ${alert.severity === 'Critical' ? 'text-[#D32F2F]' : 'text-[#D9531E]'}`}>
                      {alert.severity}
                    </span>
                    <span className="text-[#88998F]">·</span>
                    <span className="text-[#5C6E63] truncate font-medium">{alert.location}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#8DA094] group-hover:text-[#0E382B] group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Recent Reports Table */}
      <div className="saas-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-black text-[#11231B]">Recent Field Reports</h3>
            <p className="text-xs text-[#66786C] font-medium mt-0.5">
              Latest crowd-sourced and sensor-detected damage submissions.
            </p>
          </div>
          <button
            onClick={() => navigate('/my-reports')}
            className="text-xs font-bold text-[#0E382B] hover:text-[#185340] inline-flex items-center gap-1.5 transition-colors group cursor-pointer"
          >
            View all reports ({totalReports})
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DCE4D6] text-[11px] font-bold text-[#6D8073] uppercase tracking-wider bg-[#F8FAF5]">
                <th className="py-3 pl-3 rounded-l-xl">Evidence</th>
                <th className="py-3 px-3">Title & Location</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Submitted</th>
                <th className="py-3 pr-3 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBF0E6] text-xs">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-[#F9FAF6] transition-colors group">
                  {/* Thumbnail */}
                  <td className="py-3.5 pl-3">
                    <div className="w-13 h-10 rounded-xl overflow-hidden bg-stone-100 border border-[#D5DDCF] shrink-0 shadow-2xs">
                      <img
                        src={report.imageUrl || '/road_pothole.jpg'}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  {/* Title & Location */}
                  <td className="py-3.5 px-3 max-w-[280px]">
                    <p className="font-bold text-[#11231B] truncate text-xs sm:text-sm">{report.title}</p>
                    <div className="flex items-center gap-1 text-[11px] text-[#6D8073] truncate mt-0.5 font-medium">
                      <MapPin size={12} className="text-[#8FA396] shrink-0" />
                      <span className="truncate">{report.location}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-3 text-[#3B4D43] font-semibold">
                    <span className="px-2.5 py-1 rounded-lg bg-[#F2F5ED] border border-[#DCE4D6] text-[11px]">
                      {report.category}
                    </span>
                  </td>

                  {/* Severity */}
                  <td className="py-3.5 px-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap shadow-2xs ${severityBadgeStyles[report.severity]}`}>
                      {report.severity}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap shadow-2xs ${statusBadgeStyles[report.status]}`}>
                      {report.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-3 text-[#6D8073] text-[11px] font-medium whitespace-nowrap">
                    {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 pr-3 text-right">
                    <button
                      onClick={() => navigate('/my-reports')}
                      className="p-2 rounded-xl text-[#6D8073] hover:text-[#0E382B] hover:bg-[#E8F4D9] transition-all cursor-pointer"
                      aria-label={`View report ${report.id}`}
                    >
                      <ArrowRight size={16} />
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
