const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5];

const SpeedSelector = ({ value, onChange }) => {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Toc do</p>
      <div className="grid grid-cols-4 gap-2">
        {SPEED_OPTIONS.map((option) => (
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
            {option}x
          </button>
        ))}
      </div>
    </div>
  );
};

export default SpeedSelector;
