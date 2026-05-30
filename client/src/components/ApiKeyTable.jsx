import { Copy, Trash2 } from "lucide-react";

const ApiKeyTable = ({ apiKeys, onDelete, onCopy, deletingId }) => {
  return (
    <div className="surface-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Prefix</th>
              <th className="px-4 py-3 text-left font-semibold">Last used</th>
              <th className="px-4 py-3 text-left font-semibold">Created</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Chua co API key nao.
                </td>
              </tr>
            ) : null}

            {apiKeys.map((key) => (
              <tr key={key._id || key.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold text-ink">{key.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700">{key.keyPrefix}</td>
                <td className="px-4 py-3 text-slate-500">
                  {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : "Never"}
                </td>
                <td className="px-4 py-3 text-slate-500">{new Date(key.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onCopy(key)}
                      className="inline-flex items-center gap-1 rounded-lg border border-borderSoft px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Copy size={13} />
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(key)}
                      disabled={deletingId === (key._id || key.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                    >
                      <Trash2 size={13} />
                      {deletingId === (key._id || key.id) ? "Deleting" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiKeyTable;
