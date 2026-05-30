import useAuthStore from "../store/authStore";

const Account = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="surface-card p-5 animate-fadeUp">
      <h3 className="text-xl font-extrabold text-ink">Thong tin tai khoan</h3>
      <p className="text-sm text-muted mt-1">Chi tiet profile hien tai</p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-borderSoft p-3">
          <p className="text-xs uppercase tracking-wide text-muted">Ho ten</p>
          <p className="mt-1 font-semibold text-ink">{user?.name || "-"}</p>
        </div>
        <div className="rounded-xl border border-borderSoft p-3">
          <p className="text-xs uppercase tracking-wide text-muted">Email</p>
          <p className="mt-1 font-semibold text-ink">{user?.email || "-"}</p>
        </div>
        <div className="rounded-xl border border-borderSoft p-3">
          <p className="text-xs uppercase tracking-wide text-muted">Credits</p>
          <p className="mt-1 font-semibold text-ink">{Number(user?.credits || 0).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-borderSoft p-3">
          <p className="text-xs uppercase tracking-wide text-muted">User ID</p>
          <p className="mt-1 font-mono text-xs text-slate-700 break-all">{user?.id || "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default Account;
