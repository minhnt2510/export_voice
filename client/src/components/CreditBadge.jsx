import { Coins } from "lucide-react";
import useAuthStore from "../store/authStore";

const CreditBadge = () => {
  const credits = useAuthStore((state) => state.user?.credits || 0);

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 border border-emerald-100">
      <Coins size={16} className="text-emerald-600" />
      <span className="text-sm font-bold text-emerald-700">{credits.toLocaleString()} credits</span>
    </div>
  );
};

export default CreditBadge;
