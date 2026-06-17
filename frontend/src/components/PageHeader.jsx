import { Plus, Search } from 'lucide-react';

export default function PageHeader({ title, subtitle, search, setSearch, onAdd, addLabel = 'Add' }) {
  return (
    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        {setSearch && (
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={18} />
            <input className="input pl-10 sm:w-72" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" />
          </label>
        )}
        {onAdd && (
          <button className="btn-primary" onClick={onAdd}>
            <Plus size={18} />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}
