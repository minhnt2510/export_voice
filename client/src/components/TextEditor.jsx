import { useMemo } from "react";
import { AlignLeft } from "lucide-react";

const splitSentences = (value) => {
  const cleaned = value.trim();

  if (!cleaned) {
    return [];
  }

  return cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);
};

const TextEditor = ({ value, onChange, showSentences, onToggleSentences }) => {
  const sentences = useMemo(() => splitSentences(value), [value]);

  return (
    <div className="surface-card p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-ink">Text editor</h3>
          <p className="text-sm text-muted">Nhap noi dung va xem theo tung cau neu can</p>
        </div>
        <button
          type="button"
          onClick={onToggleSentences}
          className="inline-flex items-center gap-2 rounded-xl border border-borderSoft px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <AlignLeft size={15} />
          Xem theo cau
        </button>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={14}
        placeholder="Nhap noi dung... vi du: xin chao, day la giong doc AI cua toi"
        className="mt-4 w-full rounded-2xl border border-borderSoft p-4 text-sm leading-6 text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
      />

      <div className="mt-3 grid grid-cols-2 gap-3 text-xs md:text-sm">
        <div className="rounded-xl bg-slate-50 px-3 py-2 text-muted">{value.length.toLocaleString()} ky tu</div>
        <div className="rounded-xl bg-slate-50 px-3 py-2 text-muted">{sentences.length} cau</div>
      </div>

      {showSentences ? (
        <div className="mt-4 rounded-2xl border border-borderSoft bg-slate-50 p-4 max-h-[260px] overflow-y-auto">
          {sentences.length === 0 ? (
            <p className="text-sm text-slate-400">Chua co cau nao de hien thi.</p>
          ) : (
            <div className="space-y-2">
              {sentences.map((sentence, index) => (
                <p key={`${index}-${sentence.slice(0, 10)}`} className="text-sm text-slate-700">
                  <span className="font-semibold text-brand-600 mr-2">{index + 1}.</span>
                  {sentence}
                </p>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default TextEditor;
