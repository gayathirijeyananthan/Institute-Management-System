export default function StatCard({ icon: Icon, label, value, tone = 'bg-blue-50 text-blue-700' }) {
  return (
    <div className="rounded-md border border-line bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-md ${tone}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
