import React from 'react';
import { CURRENCIES } from '@/lib/currencies';

export default function CurrencySelect({ value, onChange, id }) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-12 rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition-shadow cursor-pointer"
    >
      {CURRENCIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.flag} {c.code} — {c.name}
        </option>
      ))}
    </select>
  );
}