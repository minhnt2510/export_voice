import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import creditApi from "../api/creditApi";
import useAuthStore from "../store/authStore";
import { getErrorMessage } from "../utils/errorMessage";

const CreditHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const credits = useAuthStore((state) => state.user?.credits || 0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await creditApi.getHistory();
        setHistory(data.history || []);
      } catch (error) {
        toast.error(getErrorMessage(error, "Khong the tai lich su credit"));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const totalUsed = useMemo(
    () => history.filter((item) => item.type === "use").reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [history]
  );

  if (loading) {
    return <div className="glass-card rounded-2xl p-5 text-sm text-muted">Dang tai lich su credit...</div>;
  }

  return (
    <div className="space-y-5 animate-fadeUp">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="surface-card p-5">
          <p className="text-sm text-muted">Credit con lai</p>
          <p className="mt-2 text-3xl font-extrabold text-ink">{credits.toLocaleString()}</p>
        </div>
        <div className="surface-card p-5">
          <p className="text-sm text-muted">Tong credit da dung</p>
          <p className="mt-2 text-3xl font-extrabold text-ink">{totalUsed.toLocaleString()}</p>
        </div>
        <div className="surface-card p-5">
          <p className="text-sm text-muted">Tong giao dich</p>
          <p className="mt-2 text-3xl font-extrabold text-ink">{history.length.toLocaleString()}</p>
        </div>
      </section>

      <section className="surface-card p-5">
        <h3 className="text-xl font-extrabold text-ink">Lich su giao dich credit</h3>
        <div className="mt-4 space-y-3">
          {history.length === 0 ? (
            <div className="rounded-xl border border-dashed border-borderSoft p-6 text-center text-sm text-muted">
              Chua co lich su credit.
            </div>
          ) : null}

          {history.map((item) => (
            <div key={item._id} className="rounded-xl border border-borderSoft p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">{item.description}</p>
                <p className="text-xs text-muted">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
              <span className={`text-sm font-bold ${item.type === "use" ? "text-rose-600" : "text-emerald-600"}`}>
                {item.type === "use" ? "-" : "+"}
                {item.amount}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CreditHistory;
