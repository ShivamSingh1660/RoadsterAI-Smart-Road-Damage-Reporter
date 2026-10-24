import React, { useState, useEffect, type FormEvent } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Map as MapIcon,
  FilePlus,
  FileText,
  BarChart3,
  Info,
  Menu,
  Search,
  Bell,
  ChevronLeft,
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

  const reports = loadReports();
  const criticalCount = reports.filter(
    (r) => r.severity === 'Critical' && r.status !== 'Resolved'
  ).length;

  const getBreadcrumbs = () => {
    switch (location.pathname) {
      case '/':
        return { parent: 'Workspace', current: 'Overview' };
      case '/map':
        return { parent: 'Workspace', current: 'Road Damage Map' };
      case '/report':
        return { parent: 'Field Reporting', current: 'New Entry' };
      case '/my-reports':
        return { parent: 'Workspace', current: 'My Reports' };
      case '/analytics':
        return { parent: 'Intelligence', current: 'Analytics' };
      case '/about':
        return { parent: 'Overview', current: 'About' };
      default:
        return { parent: 'Workspace', current: 'Overview' };
    }
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/my-reports?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const breadcrumb = getBreadcrumbs();

  return (
    <ToastProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#E7ECE1] text-[#11231B] font-sans antialiased">
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:relative z-50 h-full flex flex-col
            bg-[#E8EBE1] border-r border-[#D8DDD1]
            transition-all duration-300 ease-in-out shrink-0
            ${sidebarOpen ? 'w-64' : 'w-[76px]'}
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3.5 px-6 h-[76px] border-b border-[#D8DDD1] shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-[#0E382B] flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 20L10 4H14L20 20H15L12 12L9 20H4Z" fill="#C8F169" />
                <path d="M12 15V18" stroke="#0E382B" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden min-w-0">
                <h1 className="text-base font-extrabold text-[#11231B] tracking-tight leading-tight">
                  RoadsterAI
                </h1>
                <p className="text-[11px] text-[#63746A] font-medium truncate">
                  Smart Road Damage Reporter
                </p>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-5 px-3.5 space-y-1.5">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 group
                  ${
                    isActive
                      ? 'bg-[#0E382B] text-white shadow-sm'
                      : 'text-[#4A5C52] hover:text-[#11231B] hover:bg-[#DEE3D5] border border-transparent'
                  }`
                }
              >
                <Icon
                  size={19}
                  className="shrink-0 transition-transform group-hover:scale-110"
                />
                {sidebarOpen && <span className="truncate">{label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Sidebar Bottom Inspection Widget */}
          {sidebarOpen ? (
            <div className="p-3 m-3.5 rounded-2xl bg-white border border-[#D8DDD1] shadow-xs hover:border-[#CCD4C5] transition-colors">
              <div className="relative rounded-xl overflow-hidden h-20 mb-2.5 bg-stone-900">
                <img
                  src="/road_crack.jpg"
                  alt="Road inspection preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-2.5">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-bold text-white drop-shadow-sm truncate">
                      Central Lucknow / Sec 4
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/40 animate-pulse shrink-0 ml-1" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#55655C] px-1">
                <span className="font-medium">Active Sensor</span>
                <span className="font-bold text-[#0E382B] bg-[#E2EFD2] border border-[#C6DCB0] px-2 py-0.5 rounded-md text-[10px]">
                  Online
                </span>
              </div>
            </div>
          ) : null}

          {/* Collapse Toggle */}
          <div className="p-2.5 border-t border-[#D8DDD1] hidden lg:flex justify-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl text-[#6D8074] hover:text-[#11231B] hover:bg-[#DEE3D5] transition-colors"
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
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#E7ECE1]">
          {/* Top Bar Header with Generous Whitespace & Crisp Borders */}
          <header className="flex items-center justify-between px-6 sm:px-10 lg:px-12 h-20 shrink-0 bg-white border-b border-[#CCD5C5] shadow-[0_1px_4px_rgba(17,35,27,0.04)] z-20">
            {/* Left: Mobile Toggle & Breadcrumbs */}
            <div className="flex items-center gap-3.5">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2.5 rounded-xl text-[#4E5F55] hover:text-[#11231B] hover:bg-[#F2F5ED] border border-[#CCD5C5] transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu size={19} />
              </button>
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#66786C]">
                <span>{breadcrumb.parent}</span>
                <span className="text-[#A2B0A6]">/</span>
                <span className="text-sm font-bold text-[#11231B]">{breadcrumb.current}</span>
                <span className="hidden xl:inline-flex items-center text-[11px] font-semibold text-[#526458] bg-[#F2F5ED] border border-[#D5DDCF] px-2.5 py-1 rounded-lg ml-2">
                  Municipal Road Monitoring
                </span>
              </div>
            </div>

            {/* Right: Search, Date, Status, Alerts, Avatar */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Spacious, Highly Readable Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
                <Search size={18} className="navbar-search-icon" />
                <input
                  type="text"
                  placeholder="Search reports, locations, severity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="navbar-search-input w-80 lg:w-[420px]"
                />
                <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-white border border-[#D0D8C8] text-[10px] font-mono font-bold text-[#6D7F72] shadow-2xs pointer-events-none select-none">
                  ⌘K
                </kbd>
              </form>

              {/* Date Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F6F8F3] border border-[#DCE4D6] text-xs font-semibold text-[#526458]">
                <span>Oct 24, 2026</span>
              </div>

              {/* Live Status Badge */}
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#E8F4DA] border border-[#C5DDB0] text-[#1D4A14] text-xs font-bold shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <span className="hidden lg:inline">Network</span> Live
              </span>

              {/* Notification Bell */}
              <button
                onClick={() => navigate('/my-reports?severity=Critical')}
                className="relative p-2.5 rounded-xl bg-[#F8FAF5] hover:bg-white border border-[#CCD5C5] hover:border-[#0E382B] text-[#4A5D52] hover:text-[#11231B] transition-all shadow-2xs cursor-pointer"
                aria-label={`Notifications: ${criticalCount} critical issues`}
              >
                <Bell size={18} />
                {criticalCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#D32F2F] text-[10px] font-black flex items-center justify-center text-white ring-2 ring-white shadow-xs">
                    {criticalCount}
                  </span>
                )}
              </button>

              {/* User Avatar */}
              <div
                onClick={() => navigate('/about')}
                className="flex items-center gap-2.5 pl-1 cursor-pointer group"
                title="View Team Profile"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#0E382B] text-[#C8F169] text-xs font-black flex items-center justify-center ring-2 ring-white shadow-xs group-hover:scale-105 transition-transform">
                  RA
                </div>
                <div className="hidden 2xl:block text-left">
                  <p className="text-xs font-bold text-[#11231B] leading-tight">Admin Ops</p>
                  <p className="text-[10px] text-[#7A8C80] font-medium leading-none mt-0.5">Lucknow HQ</p>
                </div>
              </div>
            </div>
          </header>

          {/* Page Viewport with Contained Max Width & Ample Padding */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 sm:px-10 lg:px-12 py-8 max-w-7xl mx-auto space-y-9 pb-24">
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
