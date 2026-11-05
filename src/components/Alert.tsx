import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface AlertProps {
  tone: 'success' | 'error';
  message: string;
}

export default function Alert({ tone, message }: AlertProps) {
  const isError = tone === 'error';
  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
        isError ? 'border-rose-300 bg-rose-50 text-rose-900' : 'border-emerald-300 bg-emerald-50 text-emerald-900'
      }`}
    >
      {isError ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
      <span>{message}</span>
    </div>
  );
}
