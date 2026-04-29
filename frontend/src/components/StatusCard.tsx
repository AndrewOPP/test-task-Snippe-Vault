import type { ReactNode } from 'react';

export function StatusCard({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/75 p-6 shadow-sm backdrop-blur">
      <h3 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-6">{action}</div>
    </div>
  );
}
