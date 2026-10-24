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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/my-reports?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const breadcrumb = getBreadcrumbs();

  return (
    <ToastProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#EEF1E8] text-[#11231B] font-sans antialiased">
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
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#EEF1E8]">
          {/* Top Bar Header with Generous Whitespace */}
          <header className="flex items-center justify-between px-8 lg:px-12 h-[76px] shrink-0 bg-[#EEF1E8] border-b border-[#D8DDD1]">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-xl text-[#4E5F55] hover:text-[#11231B] hover:bg-white border border-[#D8DDD1] transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu size={19} />
              </button>
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#5A6C62]">
                <span>{breadcrumb.parent}</span>
                <span className="text-[#99A89D]">/</span>
                <span className="text-[#11231B] font-bold">{breadcrumb.current}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Spacious, Beautiful Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7C8E82] pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search reports, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 lg:w-96 pl-11 pr-4 py-2.5 rounded-full bg-white border border-[#D5DACF] text-xs text-[#11231B] placeholder:text-[#88998D] focus:outline-none focus:border-[#0E382B] focus:ring-2 focus:ring-[#0E382B]/15 transition-all shadow-xs"
                />
              </form>

              {/* Date */}
              <span className="text-xs font-semibold text-[#53655B] hidden sm:inline-block px-1">
                Oct 24, 2026
              </span>

              {/* Demo Mode Badge */}
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E2EFD2] border border-[#C6DCB0] text-[#245218] text-xs font-bold shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#245218] animate-pulse" />
                Demo Mode
              </span>

              {/* Notification Bell */}
              <button
                onClick={() => navigate('/my-reports?severity=Critical')}
                className="relative p-2.5 rounded-xl bg-white border border-[#D8DDD1] text-[#4A5D52] hover:text-[#11231B] hover:border-[#CCD4C5] transition-all shadow-xs"
                aria-label={`Notifications: ${criticalCount} critical issues`}
              >
                <Bell size={17} />
                {criticalCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D32F2F] text-[10px] font-extrabold flex items-center justify-center text-white ring-2 ring-white">
                    {criticalCount}
                  </span>
                )}
              </button>

              {/* User Avatar */}
              <div className="w-9 h-9 rounded-full bg-[#0E382B] text-[#C8F169] text-xs font-extrabold flex items-center justify-center ring-2 ring-white shadow-xs">
                RA
              </div>
            </div>
          </header>

          {/* Page Viewport with Contained Max Width */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 sm:px-8 lg:px-10 py-8 max-w-7xl mx-auto space-y-8 pb-20">
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
