import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Alert from '@/components/Alert';
import { ApiError } from '@/lib/api';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = 'Enter a valid email address';
    if (!password) next.password = 'Enter your password';
    setErrors(next);
    setFormError(null);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Sign-in failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
      <div className="hidden lg:block">
        <h1 className="font-display text-5xl font-semibold leading-tight">Welcome back to your community.</h1>
        <p className="mt-5 max-w-md text-lg text-muted">Pick up where you left off: check your matches, confirm sessions and watch your credits grow.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mx-auto w-full max-w-md space-y-5 rounded-[2rem] bg-surface p-8 shadow-lift sm:p-10">
        <div>
          <h2 className="text-3xl">Sign in</h2>
          <p className="mt-2 text-sm text-muted">Use the email you registered with.</p>
        </div>

        {formError && <Alert tone="error" message={formError} />}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-bold">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-line bg-bg px-4 py-3 outline-none transition focus:border-ink focus:ring-4 focus:ring-primary"
          />
          {errors.email && <p className="text-sm font-semibold text-rose-700">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-bold">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-line bg-bg px-4 py-3 outline-none transition focus:border-ink focus:ring-4 focus:ring-primary"
          />
          {errors.password && <p className="text-sm font-semibold text-rose-700">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-pastel-hero py-3.5 font-bold text-ink shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift disabled:opacity-60"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="text-center text-sm text-muted">
          New here? <Link to="/register" className="font-bold text-ink hover:underline">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
