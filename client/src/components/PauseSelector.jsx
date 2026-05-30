const PAUSE_OPTIONS = [100, 300, 500, 1000];

const PauseSelector = ({ value, onChange }) => {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Pause moi cau</p>
      <div className="grid grid-cols-2 gap-2">
        {PAUSE_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${
              value === option
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-borderSoft text-slate-600 hover:bg-slate-50"
            }`}
          >
            {option}ms
          </button>
        ))}
      </div>
    </div>
  );
};

export default PauseSelector;
