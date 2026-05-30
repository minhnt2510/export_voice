import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const logout = useAuthStore((state) => state.logout);
  const [isChecking, setIsChecking] = useState(Boolean(token && !user));

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      if (!token || user) {
        if (mounted) {
          setIsChecking(false);
        }
        return;
      }

      try {
        await fetchMe();
      } catch {
        logout();
      } finally {
        if (mounted) {
          setIsChecking(false);
        }
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [fetchMe, logout, token, user]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slateBg">
        <div className="glass-card rounded-2xl px-5 py-4 text-sm font-medium text-muted">Dang xac thuc phien...</div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
