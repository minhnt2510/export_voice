import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Editor from "./pages/Editor";
import TTSHistory from "./pages/TTSHistory";
import CreditHistory from "./pages/CreditHistory";
import ApiKeys from "./pages/ApiKeys";
import Account from "./pages/Account";
import useAuthStore from "./store/authStore";

function App() {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const handleAuthExpired = () => {
      useAuthStore.getState().logout();
      toast.error("Phien dang nhap da het han. Vui long dang nhap lai.");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    };

    window.addEventListener("auth:expired", handleAuthExpired);

    return () => {
      window.removeEventListener("auth:expired", handleAuthExpired);
    };
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            color: "#0f172a"
          }
        }}
      />

      <Routes>
        <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId/editor" element={<Editor />} />
          <Route path="history" element={<TTSHistory />} />
          <Route path="credits" element={<CreditHistory />} />
          <Route path="api-keys" element={<ApiKeys />} />
          <Route path="account" element={<Account />} />
        </Route>

        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </>
  );
}

export default App;
