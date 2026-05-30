import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, FolderKanban, Sparkles, History } from "lucide-react";
import creditApi from "../api/creditApi";
import ttsApi from "../api/ttsApi";
import { getErrorMessage } from "../utils/errorMessage";

const Dashboard = () => {
  const [credits, setCredits] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [creditResponse, historyResponse] = await Promise.all([creditApi.getBalance(), ttsApi.getHistory()]);
        setCredits(creditResponse.data.credits || 0);
        setHistory(historyResponse.data.history || []);
      } catch (loadError) {
        setError(getErrorMessage(loadError, "Khong the tai dashboard"));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const totalGeneratedChars = useMemo(
    () => history.reduce((sum, item) => sum + Number(item.characterCount || 0), 0),
    [history]
  );

  if (loading) {
    return <div className="glass-card rounded-2xl p-5 text-sm text-muted">Dang tai dashboard...</div>;
  }

  return (
    <div className="space-y-6 animate-fadeUp">
      {error ? <div className="surface-card p-4 text-sm font-semibold text-rose-600">{error}</div> : null}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="surface-card p-5">
          <p className="text-sm text-muted">Credit hien tai</p>
          <p className="mt-2 text-3xl font-extrabold text-ink">{credits.toLocaleString()}</p>
        </div>
        <div className="surface-card p-5">
          <p className="text-sm text-muted">Tong ky tu da tao</p>
          <p className="mt-2 text-3xl font-extrabold text-ink">{totalGeneratedChars.toLocaleString()}</p>
        </div>
        <div className="surface-card p-5">
          <p className="text-sm text-muted">Tong audio</p>
          <p className="mt-2 text-3xl font-extrabold text-ink">{history.length.toLocaleString()}</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link to="/projects" className="surface-card p-5 hover:-translate-y-0.5 transition">
          <FolderKanban className="text-brand-600" />
          <h3 className="mt-3 font-bold text-ink">Mo Projects</h3>
          <p className="mt-1 text-sm text-muted">Tao va quan ly project voice cua ban</p>
        </Link>
        <Link to="/history" className="surface-card p-5 hover:-translate-y-0.5 transition">
          <History className="text-brand-600" />
          <h3 className="mt-3 font-bold text-ink">Lich su voice</h3>
          <p className="mt-1 text-sm text-muted">Nghe lai va tai MP3 da tao</p>
        </Link>
        <Link to="/api-keys" className="surface-card p-5 hover:-translate-y-0.5 transition">
          <Sparkles className="text-brand-600" />
          <h3 className="mt-3 font-bold text-ink">Public API</h3>
          <p className="mt-1 text-sm text-muted">Tao API key de goi TTS tu app ben ngoai</p>
        </Link>
      </section>

      <section className="surface-card p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">Audio gan day</h3>
          <Activity className="text-brand-600" size={18} />
        </div>

        <div className="mt-4 space-y-3">
          {history.length === 0 ? (
            <p className="text-sm text-muted">Chua co audio nao. Hay vao project va tao voice dau tien.</p>
          ) : null}

          {history.slice(0, 5).map((item) => (
            <div key={item._id} className="rounded-xl border border-borderSoft p-3">
              <p className="text-sm font-medium text-ink truncate">{item.text}</p>
              <p className="text-xs text-muted mt-1">
                {item.voice} • {item.characterCount} chars • {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
