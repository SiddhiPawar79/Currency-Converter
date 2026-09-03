import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CurrencySelect from './CurrencySelect';

const TARGETS = ['USD', 'EUR', 'GBP', 'JPY', 'AUD'];

function fmt(n) {
  if (n == null || !isFinite(n)) return '—';
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function TravelBudget() {
  const [base, setBase] = useState('USD');
  const [amount, setAmount] = useState(1000);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke('getTravelBudget', { base, amount: Number(amount) });
      setResults(res.data.results);
    } catch (e) {
      // ignore
    }
    setLoading(false);
  };

  useEffect(() => { calculate(); }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Plane className="w-4 h-4 text-sky-500" />
        <h2 className="text-lg font-semibold tracking-tight">Travel Budgeting</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px_auto] gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Base currency</label>
          <CurrencySelect value={base} onChange={setBase} />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Amount</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full h-12 rounded-xl border border-border bg-background px-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-ring/40 transition-shadow"
          />
        </div>
        <Button onClick={calculate} disabled={loading} className="h-12">
          {loading ? 'Calculating…' : 'Calculate'}
        </Button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="py-2.5 font-medium">Currency</th>
              <th className="py-2.5 font-medium text-right">Rate</th>
              <th className="py-2.5 font-medium text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {!results && !loading && (
              <tr><td colSpan={3} className="py-6 text-center text-muted-foreground">Enter an amount and calculate.</td></tr>
            )}
            {loading && (
              <tr><td colSpan={3} className="py-6 text-center text-muted-foreground">Calculating…</td></tr>
            )}
            {results?.map((r) => (
              <tr key={r.currency} className="border-b border-border last:border-0">
                <td className="py-3 font-medium">{r.currency}</td>
                <td className="py-3 text-right tabular-nums text-muted-foreground">{fmt(r.rate)}</td>
                <td className="py-3 text-right tabular-nums font-semibold">{fmt(r.converted)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}