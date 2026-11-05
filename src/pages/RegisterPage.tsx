import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Alert from '@/components/Alert';
import { ApiError } from '@/lib/api';

interface FormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  university: string;
  location: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = { fullName: '', email: '', password: '', confirmPassword: '', university: '', location: '' };

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (form.fullName.trim().length < 2) errors.fullName = 'Enter your full name';
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = 'Enter a valid email address';
  if (form.password.length < 8) errors.password = 'Use at least 8 characters';
  else if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) errors.password = 'Include at least one letter and one number';
  if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match';
  return errors;
}

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setFormError(null);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await signUp({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        university: form.university.trim(),
        location: form.location.trim(),
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name: keyof FormState, label: string, type = 'text', autoComplete?: string) => (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-bold">{label}</label>
      <input
        id={name}
        type={type}
        autoComplete={autoComplete}
        value={form[name]}
        onChange={update(name)}
        className="w-full rounded-2xl border border-line bg-bg px-4 py-3 outline-none transition focus:border-ink focus:ring-4 focus:ring-primary"
      />
      {errors[name] && <p className="text-sm font-semibold text-rose-700">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="mx-auto grid max-w-6xl items-start gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
      <div className="lg:pt-16">
        <h1 className="font-display text-5xl font-semibold leading-tight">Start trading time for skills.</h1>
        <ul className="mt-8 space-y-4 text-muted">
          <li>Teach one hour, earn one time credit.</li>
          <li>Learn one hour, spend one time credit.</li>
          <li>Credits are never real money and never go negative.</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} noValidate className="w-full space-y-5 rounded-[2rem] bg-surface p-8 shadow-lift sm:p-10">
        <h2 className="text-3xl">Create your account</h2>
        {formError && <Alert tone="error" message={formError} />}
        {field('fullName', 'Full name', 'text', 'name')}
        {field('email', 'Email', 'email', 'email')}
        <div className="grid gap-5 sm:grid-cols-2">
          {field('password', 'Password', 'password', 'new-password')}
          {field('confirmPassword', 'Confirm password', 'password', 'new-password')}
        </div>
        <p className="-mt-2 text-xs text-muted">At least 8 characters, with one letter and one number.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          {field('university', 'University (optional)')}
          {field('location', 'City (optional)')}
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-pastel-hero py-3.5 font-bold text-ink shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift disabled:opacity-60"
        >
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
        <p className="text-center text-sm text-muted">
          Already a member? <Link to="/login" className="font-bold text-ink hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
