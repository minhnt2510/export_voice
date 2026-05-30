import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "react-hot-toast";
import apiKeyApi from "../api/apiKeyApi";
import ApiKeyTable from "../components/ApiKeyTable";
import LoadingButton from "../components/LoadingButton";
import { getErrorMessage } from "../utils/errorMessage";

const CURL_EXAMPLE = `curl -X POST http://localhost:5001/api/public/tts \\
-H "x-api-key: YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "text": "Xin chao",
  "voice": "vi-VN-Neural2-A",
  "speed": 1,
  "pause": 100
}'`;

const ApiKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [name, setName] = useState("");
  const [rawKey, setRawKey] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchApiKeys = async () => {
    const { data } = await apiKeyApi.getAll();
    setApiKeys(data.apiKeys || []);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await fetchApiKeys();
      } catch (error) {
        toast.error(getErrorMessage(error, "Khong the tai API keys"));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setCreating(true);

    try {
      const { data } = await apiKeyApi.create({ name: name || "Default key" });
      setName("");
      setRawKey(data.rawKey || "");
      toast.success("Tao API key thanh cong");
      await fetchApiKeys();
    } catch (error) {
      toast.error(getErrorMessage(error, "Tao API key that bai"));
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (key) => {
    if (!window.confirm(`Xoa API key ${key.name}?`)) {
      return;
    }

    const id = key._id || key.id;
    setDeletingId(id);

    try {
      await apiKeyApi.remove(id);
      toast.success("Da xoa API key");
      await fetchApiKeys();
    } catch (error) {
      toast.error(getErrorMessage(error, "Xoa API key that bai"));
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyPrefix = async (key) => {
    await navigator.clipboard.writeText(key.keyPrefix);
    toast.success("Da copy key prefix");
  };

  const copyRawKey = async () => {
    await navigator.clipboard.writeText(rawKey);
    toast.success("Da copy API key");
  };

  const copyCurl = async () => {
    await navigator.clipboard.writeText(CURL_EXAMPLE);
    toast.success("Da copy curl");
  };

  return (
    <div className="space-y-5 animate-fadeUp">
      <section className="surface-card p-5">
        <h3 className="text-xl font-extrabold text-ink">API Keys</h3>
        <p className="text-sm text-muted mt-1">Tao key rieng de goi endpoint public TTS</p>

        <form onSubmit={handleCreate} className="mt-4 flex flex-col md:flex-row gap-2">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ten API key"
            className="w-full rounded-xl border border-borderSoft px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
          />
          <LoadingButton loading={creating} loadingText="Dang tao..." type="submit" className="md:min-w-[150px]">
            Tao API key
          </LoadingButton>
        </form>

        {rawKey ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              API key moi (chi hien thi 1 lan)
            </p>
            <p className="mt-1 break-all font-mono text-sm text-emerald-900">{rawKey}</p>
            <button
              type="button"
              onClick={copyRawKey}
              className="mt-3 inline-flex items-center gap-1 rounded-lg border border-emerald-300 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
            >
              <Copy size={13} />
              Copy API key
            </button>
          </div>
        ) : null}
      </section>

      {loading ? (
        <div className="glass-card rounded-2xl p-5 text-sm text-muted">Dang tai API keys...</div>
      ) : (
        <ApiKeyTable apiKeys={apiKeys} onDelete={handleDelete} onCopy={handleCopyPrefix} deletingId={deletingId} />
      )}

      <section className="surface-card p-5">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-base font-bold text-ink">Huong dan goi API</h4>
          <button
            type="button"
            onClick={copyCurl}
            className="inline-flex items-center gap-1 rounded-lg border border-borderSoft px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Copy size={13} />
            Copy curl
          </button>
        </div>

        <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs leading-6 text-slate-100">
{CURL_EXAMPLE}
        </pre>
      </section>
    </div>
  );
};

export default ApiKeys;
