import { Building2, GraduationCap, Users, UserRoundCog } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatCard from '../components/StatCard.jsx';
import { fetchDashboard } from '../features/dashboardSlice.js';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { totals, studentGrowth, attendanceSummary, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Operational snapshot for your institute.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total Students" value={loading ? '...' : totals.students} />
        <StatCard icon={GraduationCap} label="Total Cohorts" value={loading ? '...' : totals.cohorts} tone="bg-emerald-50 text-emerald-700" />
        <StatCard icon={Building2} label="Total Centers" value={loading ? '...' : totals.centers} tone="bg-amber-50 text-amber-700" />
        <StatCard icon={UserRoundCog} label="Total Staff" value={loading ? '...' : totals.staff} tone="bg-rose-50 text-rose-700" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-md border border-line bg-white p-5 shadow-soft">
          <h2 className="text-base font-semibold text-ink">Student Growth</h2>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studentGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area dataKey="students" stroke="#2563eb" fill="#bfdbfe" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="rounded-md border border-line bg-white p-5 shadow-soft">
          <h2 className="text-base font-semibold text-ink">Attendance Summary</h2>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceSummary}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0f9f8f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
