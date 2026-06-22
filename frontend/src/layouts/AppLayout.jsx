import { Activity, Bell, Building2, CalendarDays, GraduationCap, LayoutDashboard, LogOut, Menu, Users, UserRoundCog, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice.js';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/centers', label: 'Centers', icon: Building2 },
  { to: '/cohorts', label: 'Cohorts', icon: GraduationCap },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/staff', label: 'Staff', icon: UserRoundCog },
  { to: '/activities', label: 'Activities', icon: Activity },
  { to: '/attendance', label: 'Attendance', icon: CalendarDays },
  { to: '/announcements', label: 'Announcements', icon: Bell }
];

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signOut = () => {
    dispatch(logout());
    navigate('/login');
  };

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-line bg-white">
      <div className="flex h-16 items-center justify-between border-b border-line px-5">
        <div>
          <p className="text-sm font-semibold uppercase text-brand">IMS</p>
          <p className="text-xs text-slate-500">Institute Portal</p>
        </div>
        <button className="btn-ghost h-9 w-9 px-0 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X size={18} />
        </button>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-blue-50 text-brand' : 'text-slate-600 hover:bg-slate-50'}`
            }
            to={to}
            key={to}
            onClick={() => setOpen(false)}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );

  return (
    <div className="min-h-screen lg:flex">
      <div className="hidden lg:block">{sidebar}</div>
      {open && <div className="fixed inset-0 z-40 lg:hidden">{sidebar}</div>}
      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/95 px-4 backdrop-blur lg:px-6">
          <button className="btn-ghost h-10 w-10 px-0 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{user?.instituteName}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
          <button className="btn-ghost" onClick={signOut}>
            <LogOut size={18} />
            Logout
          </button>
        </header>
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
