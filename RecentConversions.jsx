import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { History } from 'lucide-react';

function fmt(n) {
  if (n == null || !isFinite(n)) return '—';
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return d.toLocaleDateString();
}

export default function RecentConversions({ refreshKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    base44.entities.ConversionHistory.list('-created_date', 6)
      .then((res) => { if (!cancelled) setItems(res); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [refreshKey]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold tracking-tight">Recent Conversions</h2>
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Your saved conversions will appear here.</p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((it) => (
            <li key={it.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">{it.from_currency}</span>
                <span className="text-muted-foreground">{fmt(it.amount)}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-semibold tabular-nums">{fmt(it.converted_amount)}</span>
                <span className="text-muted-foreground">{it.to_currency}</span>
              </div>
              <span className="text-xs text-muted-foreground">{timeAgo(it.created_date)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}