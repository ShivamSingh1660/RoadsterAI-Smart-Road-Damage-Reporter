import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Map as MapIcon,
  FilePlus,
  FileText,
  BarChart3,
  Info,
  Menu,
  X,
  Search,
  Bell,
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { ToastProvider } from './components/Toast';
import { loadReports } from './store';
import Overview from './pages/Overview';
import MapPage from './pages/MapPage';
import ReportDamage from './pages/ReportDamage';
import MyReports from './pages/MyReports';
import Analytics from './pages/Analytics';
import About from './pages/About';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/map', icon: MapIcon, label: 'Road Damage Map' },
  { to: '/report', icon: FilePlus, label: 'Report Damage' },
  { to: '/my-reports', icon: FileText, label: 'My Reports' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/about', icon: Info, label: 'About' },
];

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Count unresolved critical issues for notification badge
  const reports = loadReports();
  const criticalCount = reports.filter(
    (r) => r.severity === 'Critical' && r.status !== 'Resolved'
  ).length;

  // Breadcrumb path helper
  const getBreadcrumb = () => {
    switch (location.pathname) {
      case '/':
        return 'Workspace / Overview';
      case '/map':
        return 'Workspace / Road Damage Map';
      case '/report':
        return 'Field Reporting / New Entry';
      case '/my-reports':
        return 'Workspace / My Reports';
      case '/analytics':
        return 'Intelligence / Analytics';
      case '/about':
        return 'Overview / About';
      default:
        return 'Workspace / Overview';
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/my-reports?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <ToastProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#F6F7F2] text-[#15221B]">
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:relative z-50 h-full flex flex-col
            bg-[#F2F3EC] border-r border-[#E2E6DC]
            transition-all duration-300 ease-in-out shrink-0
            ${sidebarOpen ? 'w-60' : 'w-[72px]'}
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-5 h-16 border-b border-[#E2E6DC]/80 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-[#0E382B] flex items-center justify-center shrink-0 shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 20L10 4H14L20 20H15L12 12L9 20H4Z" fill="#C8F169" />
                <path d="M12 15V18" stroke="#0E382B" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden min-w-0">
                <h1 className="text-base font-bold text-[#15221B] tracking-tight leading-none">
                  RoadsterAI
                </h1>
                <p className="text-[10px] text-[#708076] mt-0.5 tracking-tight font-medium truncate">
                  Smart Road Damage Reporter
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                  ${
                    isActive
                      ? 'bg-[#DFE9D5] text-[#0E382B] font-semibold shadow-xs border border-[#CFDFBF]'
                      : 'text-[#4E5F55] hover:text-[#15221B] hover:bg-[#E7EAE0]'
                  }`
                }
              >
                <Icon
                  size={18}
                  className="shrink-0 transition-colors"
                />
                {sidebarOpen && <span className="truncate">{label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Sidebar Bottom Inspection Widget */}
          {sidebarOpen ? (
            <div className="p-3 m-3 rounded-2xl bg-white border border-[#E2E6DC] shadow-xs">
              <div className="relative rounded-xl overflow-hidden h-20 mb-2">
                <img
                  src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80"
                  alt="Road inspection"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-2">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-semibold text-white drop-shadow-sm truncate">
                      Central Lucknow / Sec 4
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30 animate-pulse shrink-0 ml-1" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#55655C]">
                <span>Active Scanner</span>
                <span className="font-semibold text-[#0E382B] bg-[#E8F4D9] px-1.5 py-0.5 rounded text-[10px]">
                  Online
                </span>
              </div>
            </div>
          ) : null}

          {/* Collapse Toggle */}
          <div className="p-2 border-t border-[#E2E6DC] hidden lg:flex justify-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl text-[#708076] hover:text-[#15221B] hover:bg-[#E7EAE0] transition-colors"
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <ChevronLeft
                size={18}
                className={`transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F6F7F2]">
          {/* Top Bar Header */}
          <header className="flex items-center justify-between px-4 lg:px-8 h-16 shrink-0 bg-[#F6F7F2] border-b border-[#E2E6DC]">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-xl text-[#4E5F55] hover:text-[#15221B] hover:bg-white border border-[#E2E6DC] transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu size={18} />
              </button>
              <span className="text-xs font-medium text-[#7A8B80] tracking-wide hidden sm:inline-block">
                {getBreadcrumb()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B9C92]" />
                <input
                  type="text"
                  placeholder="Search reports, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-9 pr-4 py-1.5 rounded-full bg-white border border-[#E2E6DC] text-xs text-[#15221B] placeholder:text-[#8B9C92] focus:outline-none focus:border-[#0E382B] focus:ring-1 focus:ring-[#0E382B]/20 transition-all shadow-xs"
                />
              </form>

              {/* Date */}
              <span className="text-xs font-medium text-[#5E6E64] hidden sm:inline-block mr-1">
                Oct 24, 2026
              </span>

              {/* Demo Mode Badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F4D9] border border-[#D2E4BE] text-[#2C5A20] text-xs font-semibold shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2C5A20]" />
                Demo Mode
              </span>

              {/* Notification Bell */}
              <button
                onClick={() => navigate('/my-reports?severity=Critical')}
                className="relative p-2 rounded-xl text-[#4E5F55] hover:text-[#15221B] hover:bg-white border border-transparent hover:border-[#E2E6DC] transition-all"
                aria-label={`Notifications: ${criticalCount} critical issues`}
              >
                <Bell size={18} />
                {criticalCount > 0 && (
                  <span className="absolute 1 top-1 right-1 w-4 h-4 rounded-full bg-[#D32F2F] text-[10px] font-bold flex items-center justify-center text-white ring-2 ring-[#F6F7F2]">
                    {criticalCount}
                  </span>
                )}
              </button>

              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full bg-[#E2E8DC] border border-[#CBD5C4] flex items-center justify-center text-xs font-bold text-[#0E382B]">
                RA
              </div>
            </div>
          </header>

          {/* Page Viewport */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto pb-16">
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/report" element={<ReportDamage />} />
                <Route path="/my-reports" element={<MyReports />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
