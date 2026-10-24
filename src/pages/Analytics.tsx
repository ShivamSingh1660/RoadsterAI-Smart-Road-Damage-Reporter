import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { loadReports } from '../store';
import type { Severity, Category, Status } from '../types';

const categoryColors: Record<string, string> = {
  Pothole: '#0E382B',
  'Road Crack': '#E06B26',
  'Surface Damage': '#2A7B9B',
  Waterlogging: '#7B52A6',
  Other: '#A6B5A4',
};

const severityColors: Record<Severity, string> = {
  Critical: '#D32F2F',
  High: '#E06B26',
  Medium: '#C28416',
  Low: '#1B7837',
};

const statusColors: Record<Status, string> = {
  Submitted: '#5E35B1',
  'Under Review': '#B86E12',
  'In Progress': '#1976D2',
  Resolved: '#2E7D32',
};

const tooltipStyle = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E2E6DC',
  borderRadius: '12px',
  color: '#15221B',
  fontSize: '11px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
};

// Trend points
const trendPoints = [
  { day: 'Oct 16', reports: 4 },
  { day: 'Oct 17', reports: 7 },
  { day: 'Oct 18', reports: 6 },
  { day: 'Oct 19', reports: 11 },
  { day: 'Oct 20', reports: 14 },
  { day: 'Oct 21', reports: 18 },
  { day: 'Oct 22', reports: 24 },
];

export default function Analytics() {
  const reports = useMemo(() => loadReports(), []);

  // Category breakdown
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    const total = reports.length || 1;
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      percent: Math.round((value / total) * 100),
      color: categoryColors[name] || '#88998F',
    }));
  }, [reports]);

  // Severity breakdown
  const severityData = useMemo(() => {
    const order: Severity[] = ['Critical', 'High', 'Medium', 'Low'];
    const counts: Record<string, number> = {};
    reports.forEach((r) => {
      counts[r.severity] = (counts[r.severity] || 0) + 1;
    });
    return order.map((s) => ({
      name: s,
      value: counts[s] || 0,
      fill: severityColors[s],
    }));
  }, [reports]);

  // Status breakdown
  const statusData = useMemo(() => {
    const order: Status[] = ['Submitted', 'Under Review', 'In Progress', 'Resolved'];
    const counts: Record<string, number> = {};
    reports.forEach((r) => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return order.map((st) => ({
      name: st,
      value: counts[st] || 0,
      fill: statusColors[st],
    }));
  }, [reports]);

  // Top locations
  const topLocations = useMemo(() => {
    const counts: Record<string, number> = {
      'Hazratganj Road': 5,
      'Gomti Nagar': 4,
      'Indira Nagar': 3,
      'Aliganj': 3,
      'Charbagh': 2,
    };
    // Enrich with any actual reports
    reports.forEach((r) => {
      const locKey = r.location.split(',')[0].trim();
      counts[locKey] = (counts[locKey] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }, [reports]);

  const maxLocationCount = topLocations[0]?.count || 1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#15221B]">
          Analytics
        </h1>
        <p className="text-sm text-[#5C6E63] mt-0.5">
          Data-driven insights for better road infrastructure.
        </p>
      </div>

      {/* Top Row: 4 Metric Cards (Key Insight + 3 Distribution Charts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Key Insight Card */}
        <div className="bg-[#E8F4D9]/60 border border-[#D2E4BE] rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#0E382B] text-[#C8F169] flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D5A20]">
                Key Insight
              </h3>
            </div>
            <p className="text-xs text-[#15221B] font-medium leading-relaxed">
              Potholes account for <span className="font-bold text-[#0E382B]">36%</span> of all reported issues.
              Focus on high-severity potholes in Hazratganj Road and Gomti Nagar for maximum public safety impact.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#DFEBD4] flex items-center justify-between text-[11px] text-[#2D5A20] font-semibold">
            <span>Priority Recommendation</span>
            <ArrowUpRight size={14} />
          </div>
        </div>

        {/* Damage Categories */}
        <div className="bg-white border border-[#E2E6DC] rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A8B80] mb-2">
            Damage Categories
          </h3>
          <div className="flex items-center h-44">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={36}
                    outerRadius={56}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cat-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-1 pl-1">
              {categoryData.slice(0, 4).map((c) => (
                <div key={c.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="text-[#55655C] truncate">{c.name}</span>
                  </div>
                  <span className="font-bold text-[#15221B]">{c.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Severity Breakdown Bar */}
        <div className="bg-white border border-[#E2E6DC] rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A8B80] mb-2">
            Severity Breakdown
          </h3>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} barSize={22}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#7C8C83', fontSize: 10 }}
                  axisLine={{ stroke: '#E2E6DC' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#7C8C83', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={18}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {severityData.map((entry, index) => (
                    <Cell key={`sev-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white border border-[#E2E6DC] rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A8B80] mb-2">
            Status Distribution
          </h3>
          <div className="flex items-center h-44">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={36}
                    outerRadius={56}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`stat-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-1.5 pl-1">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.fill }} />
                    <span className="text-[#55655C] truncate">{s.name}</span>
                  </div>
                  <span className="font-bold text-[#15221B]">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Report Trend Area Chart (8-cols) + Top Locations (4-cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Report Trend */}
        <div className="lg:col-span-8 bg-white border border-[#E2E6DC] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#15221B]">Report Trend</h3>
              <p className="text-xs text-[#5C6E63] mt-0.5">Incident submission velocity over time</p>
            </div>
            <span className="text-xs font-semibold text-[#0E382B] bg-[#E8F4D9] px-3 py-1 rounded-full border border-[#D2E4BE]">
              +33% weekly growth
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendPoints}>
                <defs>
                  <linearGradient id="analyticsTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82A769" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#82A769" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#7C8C83', fontSize: 11 }}
                  axisLine={{ stroke: '#E2E6DC' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#7C8C83', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={24}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="reports"
                  stroke="#3B6B30"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#analyticsTrend)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Locations */}
        <div className="lg:col-span-4 bg-white border border-[#E2E6DC] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#15221B]">Top Locations</h3>
            <p className="text-xs text-[#5C6E63] mt-0.5">High frequency incident zones</p>
          </div>

          <div className="space-y-3.5 my-4">
            {topLocations.map((loc) => {
              const pct = Math.round((loc.count / maxLocationCount) * 100);
              return (
                <div key={loc.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#15221B] flex items-center gap-1.5">
                      <MapPin size={12} className="text-[#0E382B]" />
                      {loc.name}
                    </span>
                    <span className="font-bold text-[#0E382B] bg-[#F2F3EC] px-2 py-0.5 rounded-md text-[11px]">
                      {loc.count}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#EAECE4] overflow-hidden">
                    <div
                      className="h-full bg-[#0E382B] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-[#7A8B80] italic">
            Prioritize resource deployment to Hazratganj Road and Gomti Nagar first.
          </p>
        </div>
      </div>
    </div>
  );
}
