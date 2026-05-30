import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, UserRoundPlus } from "lucide-react";
import { toast } from "react-hot-toast";
import useAuthStore from "../store/authStore";
import LoadingButton from "../components/LoadingButton";
import { getErrorMessage } from "../utils/errorMessage";

const Register = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.isAuthLoading);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const disabled = useMemo(
    () => !form.name.trim() || !form.email.trim() || !form.password.trim(),
    [form.email, form.name, form.password]
  );

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await register(form);
      toast.success("Dang ky thanh cong, ban co 10,000 credits");
      navigate("/projects");
    } catch (submitError) {
      const message = getErrorMessage(submitError, "Dang ky that bai");
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slateBg">
      <section className="hidden lg:flex relative overflow-hidden bg-brand-gradient text-white p-12">
        <div className="absolute inset-0 opacity-20 bg-hero-gradient" />
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
            <Sparkles size={16} />
            ViVibe AI Voice Platform
          </div>
          <h1 className="mt-8 text-4xl font-extrabold leading-tight">
            Bien van ban thanh giong doc AI tu nhien trong vai giay.
          </h1>
          <p className="mt-4 text-white/90">
            Dang ky tai khoan de khoi tao project voice dau tien va tao audio MP3 cho video cua ban.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center p-5 md:p-8">
        <form onSubmit={handleSubmit} className="glass-card w-full max-w-md rounded-3xl p-6 md:p-8 animate-fadeUp">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow">
            <UserRoundPlus size={20} />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-ink">Dang ky</h2>
          <p className="mt-1 text-sm text-muted">Nhan ngay 10,000 credits khi tao tai khoan</p>

          <div className="mt-6 space-y-3">
            <input
              type="text"
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
              placeholder="Ho ten"
              className="w-full rounded-xl border border-borderSoft px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
            />
            <input
              type="email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-borderSoft px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
            />
            <input
              type="password"
              value={form.password}
              onChange={(event) => handleChange("password", event.target.value)}
              placeholder="Mat khau (toi thieu 6 ky tu)"
              className="w-full rounded-xl border border-borderSoft px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
            />
          </div>

          {error ? <p className="mt-3 text-sm font-medium text-rose-600">{error}</p> : null}

          <LoadingButton
            loading={loading}
            loadingText="Dang tao tai khoan..."
            disabled={disabled}
            type="submit"
            className="mt-5 w-full"
          >
            Tao tai khoan
          </LoadingButton>

          <p className="mt-4 text-sm text-muted">
            Da co tai khoan?{" "}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Dang nhap
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
};

export default Register;
