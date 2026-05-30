import { NavLink, useNavigate } from "react-router-dom";
import {
  WandSparkles,
  FolderKanban,
  History,
  Coins,
  Users,
  Mic2,
  KeyRound,
  Rocket,
  UserCircle2,
  LogOut,
  Bot
} from "lucide-react";
import useAuthStore from "../store/authStore";

const menus = [
  { to: "/dashboard", label: "Doc van ban", icon: WandSparkles },
  { to: "/projects", label: "Du an cua ban", icon: FolderKanban },
  { to: "/history", label: "Lich su voice", icon: History },
  { to: "/credits", label: "Lich su credit", icon: Coins },
  { to: null, label: "Giong noi cong dong", icon: Users },
  { to: null, label: "Giong noi cua ban", icon: Mic2 },
  { to: "/api-keys", label: "API Keys", icon: KeyRound },
  { to: null, label: "Mua goi", icon: Rocket }
];

const Sidebar = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-full xl:w-[300px] border-r border-borderSoft bg-white/80 backdrop-blur-lg xl:min-h-screen">
      <div className="p-5 border-b border-borderSoft">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-brand-gradient text-white flex items-center justify-center shadow-glow">
            <Bot size={22} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-ink">ViVibe</h1>
            <p className="text-xs text-muted">AI Voice Studio</p>
          </div>
        </div>
        <span className="mt-4 inline-flex rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          AI Voice Studio
        </span>
      </div>

      <nav className="p-4 space-y-2">
        {menus.map((item) => {
          const Icon = item.icon;

          if (!item.to) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-xl border border-dashed border-borderSoft px-3 py-2.5 text-sm text-slate-400"
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </div>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-brand-gradient text-white shadow-glow"
                    : "text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                }`
              }
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Credits</p>
            <p className="text-lg font-bold text-ink">{Number(user?.credits || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Tai khoan</p>
            <p className="truncate text-sm font-semibold text-ink">{user?.email || "-"}</p>
          </div>
          <NavLink to="/account" className="flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">
            <UserCircle2 size={16} />
            Quan ly tai khoan
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <LogOut size={16} />
            Dang xuat
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
