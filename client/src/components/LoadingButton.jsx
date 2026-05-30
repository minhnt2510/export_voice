import { Loader2 } from "lucide-react";

const variantStyles = {
  primary: "bg-brand-gradient text-white hover:opacity-95 disabled:opacity-60",
  secondary: "bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60",
  outline: "border border-borderSoft bg-white text-ink hover:bg-slate-50 disabled:opacity-60",
  danger: "bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
};

const LoadingButton = ({
  loading = false,
  loadingText = "Dang xu ly...",
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        variantStyles[variant]
      } ${className}`}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : null}
      {loading ? loadingText : children}
    </button>
  );
};

export default LoadingButton;
