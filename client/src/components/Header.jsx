import { useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import CreditBadge from "./CreditBadge";

const pageMeta = {
  "/dashboard": {
    title: "Doc van ban",
    subtitle: "Bien van ban thanh giong doc AI tu nhien trong vai giay."
  },
  "/projects": {
    title: "Du an cua ban",
    subtitle: "Tao va quan ly cac du an giong doc AI cua ban"
  },
  "/history": {
    title: "Lich su voice",
    subtitle: "Theo doi tat ca audio da tao va tai lai nhanh"
  },
  "/credits": {
    title: "Lich su credit",
    subtitle: "Kiem soat muc tieu thu credit cua ban"
  },
  "/api-keys": {
    title: "API Keys",
    subtitle: "Quan ly khoa truy cap public TTS API"
  },
  "/account": {
    title: "Tai khoan",
    subtitle: "Thong tin dang nhap va bao mat"
  }
};

const Header = () => {
  const location = useLocation();

  const matchedKey = Object.keys(pageMeta).find((key) => location.pathname.startsWith(key));
  const meta = pageMeta[matchedKey] || {
    title: "ViVibe Clone",
    subtitle: "AI voice workspace"
  };

  return (
    <header className="mb-6 animate-fadeUp">
      <div className="glass-card rounded-3xl p-5 md:p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            <Sparkles size={14} />
            Startup Grade UI
          </div>
          <h2 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight text-ink">{meta.title}</h2>
          <p className="mt-1 text-sm text-muted">{meta.subtitle}</p>
        </div>
        <CreditBadge />
      </div>
    </header>
  );
};

export default Header;
