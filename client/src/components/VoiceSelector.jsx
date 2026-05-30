const VoiceSelector = ({ voices, value, onChange }) => {
  return (
    <div className="space-y-2">
      {voices.map((voice) => {
        const isActive = value === voice.id;

        return (
          <button
            key={voice.id}
            type="button"
            onClick={() => onChange(voice.id)}
            className={`w-full rounded-2xl border p-3 text-left transition ${
              isActive
                ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                : "border-borderSoft bg-white hover:border-brand-200"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-ink">{voice.name}</p>
                <p className="text-xs text-muted mt-1">
                  {voice.gender || "unknown"} • {voice.accent || "viet nam"} • {voice.provider}
                </p>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(voice.tags || []).map((tag) => (
                <span
                  key={`${voice.id}-${tag}`}
                  className="rounded-full border border-brand-100 bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default VoiceSelector;
