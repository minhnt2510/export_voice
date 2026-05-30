import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, AudioWaveform } from "lucide-react";
import { toast } from "react-hot-toast";
import useAuthStore from "../store/authStore";
import LoadingButton from "../components/LoadingButton";
import { getErrorMessage } from "../utils/errorMessage";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.isAuthLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const disabled = useMemo(() => !email.trim() || !password.trim(), [email, password]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login({ email, password });
      toast.success("Dang nhap thanh cong");
      navigate("/projects");
    } catch (submitError) {
      const message = getErrorMessage(submitError, "Dang nhap that bai");
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
            Tao audio chat luong cao cho video ngan, podcast, quang cao va noi dung social media.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center p-5 md:p-8">
        <form onSubmit={handleSubmit} className="glass-card w-full max-w-md rounded-3xl p-6 md:p-8 animate-fadeUp">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow">
            <AudioWaveform size={20} />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-ink">Dang nhap</h2>
          <p className="mt-1 text-sm text-muted">Tiep tuc voi workspace ViVibe cua ban</p>

          <div className="mt-6 space-y-3">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-borderSoft px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mat khau"
              className="w-full rounded-xl border border-borderSoft px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
            />
          </div>

          {error ? <p className="mt-3 text-sm font-medium text-rose-600">{error}</p> : null}

          <LoadingButton
            loading={loading}
            loadingText="Dang dang nhap..."
            disabled={disabled}
            type="submit"
            className="mt-5 w-full"
          >
            Dang nhap
          </LoadingButton>

          <p className="mt-4 text-sm text-muted">
            Chua co tai khoan?{" "}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
              Dang ky ngay
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
};

export default Login;
