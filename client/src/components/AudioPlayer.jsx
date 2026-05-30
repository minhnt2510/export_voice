import { useMemo, useState } from "react";
import { Copy, Download, ExternalLink, PlayCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const AudioPlayer = ({ audioUrl, voice, characterCount, creditUsed, createdAt }) => {
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);

  const formattedDuration = useMemo(() => {
    if (!duration || Number.isNaN(duration)) {
      return "0:00";
    }

    const totalSeconds = Math.floor(duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }, [duration]);

  if (!audioUrl) {
    return null;
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(audioUrl);
    toast.success("Da sao chep link audio");
  };

  const openInNewTab = () => {
    window.open(audioUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="surface-card p-5 md:p-6 animate-fadeUp">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-ink">Voice da san sang</h3>
          <p className="text-sm text-muted">Nghe lai, tai MP3 hoac copy link de chia se</p>
        </div>
        <PlayCircle className="text-brand-600" />
      </div>

      <audio
        key={audioUrl}
        className="w-full mt-4"
        controls
        src={audioUrl}
        onLoadedMetadata={(event) => {
          setAudioError(false);
          setDuration(event.currentTarget.duration || 0);
        }}
        onError={() => {
          setAudioError(true);
          setDuration(0);
        }}
      />

      {audioError ? (
        <p className="mt-2 text-sm font-medium text-rose-600">
          Khong the phat file audio. Co the file da bi loi hoac backend chua tao file dung.
        </p>
      ) : (
        <p className="mt-2 text-xs text-muted">Duration: {formattedDuration}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={audioUrl}
          className="inline-flex items-center gap-2 rounded-xl border border-borderSoft bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <PlayCircle size={16} />
          Nghe lai
        </a>
        <a
          href={audioUrl}
          download
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Download size={16} />
          Tai MP3
        </a>
        <button
          type="button"
          onClick={openInNewTab}
          className="inline-flex items-center gap-2 rounded-xl border border-borderSoft bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ExternalLink size={16} />
          Mo file audio
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-2 rounded-xl border border-borderSoft bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Copy size={16} />
          Sao chep link
        </button>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2 text-xs text-muted">
        <p>Voice: {voice || "-"}</p>
        <p>Ky tu: {Number(characterCount || 0).toLocaleString()}</p>
        <p>Credit da tru: {Number(creditUsed || 0).toLocaleString()}</p>
        <p>Thoi gian tao: {createdAt ? new Date(createdAt).toLocaleString() : "-"}</p>
      </div>
    </div>
  );
};

export default AudioPlayer;
