import { Edit2, Trash2 } from 'lucide-react';

export default function DataTable({ columns, rows, loading, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th className="table-th" key={column.key}>
                  {column.label}
                </th>
              ))}
              <th className="table-th w-28 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="table-td text-center" colSpan={columns.length + 1}>
                  Loading records...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="table-td text-center" colSpan={columns.length + 1}>
                  No records found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row._id} className="hover:bg-slate-50">
                  {columns.map((column) => (
                    <td className="table-td" key={column.key}>
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                  <td className="table-td">
                    <div className="flex justify-end gap-2">
                      <button aria-label="Edit" className="btn-ghost h-9 w-9 px-0" onClick={() => onEdit(row)}>
                        <Edit2 size={16} />
                      </button>
                      <button aria-label="Delete" className="btn-ghost h-9 w-9 px-0 text-red-600" onClick={() => onDelete(row._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
