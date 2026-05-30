import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "react-hot-toast";
import ttsApi from "../api/ttsApi";
import { getErrorMessage } from "../utils/errorMessage";

const truncateText = (text, max = 120) => {
  if (typeof text !== "string") {
    return "";
  }

  if (text.length <= max) {
    return text;
  }

  return `${text.slice(0, max)}...`;
};

const formatDuration = (seconds) => {
  if (!seconds || Number.isNaN(Number(seconds))) {
    return "--";
  }

  const total = Math.floor(Number(seconds));
  const min = Math.floor(total / 60);
  const sec = total % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
};

const TTSHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [audioInfoById, setAudioInfoById] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await ttsApi.getHistory();
        setHistory(Array.isArray(data?.history) ? data.history : []);
      } catch (error) {
        toast.error(getErrorMessage(error, "Khong the tai lich su voice"));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const safeHistory = useMemo(() => {
    if (!Array.isArray(history)) {
      return [];
    }

    return history.filter((item) => item && typeof item === "object");
  }, [history]);

  const markAudioError = (id) => {
    setAudioInfoById((prev) => ({
      ...prev,
      [id]: {
        hasError: true,
        loadedDuration: null
      }
    }));
  };

  const markAudioLoaded = (id, duration) => {
    setAudioInfoById((prev) => ({
      ...prev,
      [id]: {
        hasError: false,
        loadedDuration: duration
      }
    }));
  };

  if (loading) {
    return <div className="glass-card rounded-2xl p-5 text-sm text-muted">Dang tai lich su voice...</div>;
  }

  return (
    <div className="surface-card p-5 animate-fadeUp">
      <h3 className="text-xl font-extrabold text-ink">Lich su voice</h3>
      <p className="text-sm text-muted mt-1">Danh sach audio da tao va tai lai bat ky luc nao</p>

      <div className="mt-4 space-y-3">
        {safeHistory.length === 0 ? (
          <div className="rounded-xl border border-dashed border-borderSoft p-6 text-center text-sm text-muted">
            Chua co voice nao trong lich su.
          </div>
        ) : null}

        {safeHistory.map((item, index) => {
          const rowId = String(item?._id || `legacy-${index}`);
          const audioUrl =
            (typeof item?.audioUrl === "string" && item.audioUrl) ||
            (typeof item?.audio?.audioUrl === "string" && item.audio.audioUrl) ||
            "";

          const rowAudioInfo = audioInfoById[rowId] || {};
          const duration =
            item?.metadata?.duration ?? item?.duration ?? item?.audio?.duration ?? rowAudioInfo?.loadedDuration ?? null;

          return (
            <div key={rowId} className="rounded-xl border border-borderSoft p-4">
              <p className="text-sm font-semibold text-ink">{truncateText(item?.text || "") || "(Khong co noi dung)"}</p>

              <p className="mt-1 text-xs text-muted">
                {(item?.voice || "unknown") +
                  " - " +
                  Number(item?.characterCount || 0) +
                  " chars - credit " +
                  Number(item?.creditUsed || 0) +
                  " - " +
                  (item?.createdAt ? new Date(item.createdAt).toLocaleString() : "Chua xac dinh")}
              </p>

              <p className="mt-1 text-xs text-muted">Duration: {formatDuration(duration)}</p>

              {!audioUrl ? (
                <p className="mt-2 text-xs text-amber-700">Khong co file audio</p>
              ) : (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <audio
                      key={audioUrl}
                      controls
                      src={audioUrl}
                      className="w-full"
                      onLoadedMetadata={(event) => {
                        markAudioLoaded(rowId, event?.currentTarget?.duration ?? null);
                      }}
                      onError={() => {
                        markAudioError(rowId);
                      }}
                    />

                    <a
                      href={audioUrl}
                      download
                      className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold ${
                        rowAudioInfo?.hasError
                          ? "pointer-events-none border-slate-200 text-slate-300"
                          : "border-borderSoft text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Download size={13} />
                      Tai
                    </a>
                  </div>

                  {rowAudioInfo?.hasError ? (
                    <p className="mt-2 text-xs text-rose-600">File audio bi loi hoac khong ton tai</p>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TTSHistory;
