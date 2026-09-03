import React from 'react';
import { ArrowRight, RefreshCw, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CurrencySelect from './CurrencySelect';

function formatNumber(n) {
  if (n == null || !isFinite(n)) return '—';
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CurrencyConverter({
  from, to, setFrom, setTo,
  amount, setAmount,
  converted, latestRate, loading,
  onSwap, onSave, isFavorite, onToggleFavorite
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold tracking-tight">Converter</h2>
        <button
          onClick={onToggleFavorite}
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
            isFavorite ? 'text-amber-600 bg-amber-50' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
          {isFavorite ? 'Favorited' : 'Add favorite'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-end gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">From</label>
          <CurrencySelect value={from} onChange={setFrom} id="from-currency" />
        </div>

        <button
          onClick={onSwap}
          title="Swap currencies"
          className="hidden md:flex items-center justify-center w-10 h-12 mx-auto rounded-xl border border-border bg-background hover:bg-muted transition-colors shrink-0"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={onSwap}
          className="md:hidden inline-flex items-center justify-center gap-1.5 h-10 rounded-xl border border-border bg-background hover:bg-muted text-xs font-medium transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Swap
        </button>

        <div className="flex-1">
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">To</label>
          <CurrencySelect value={to} onChange={setTo} id="to-currency" />
        </div>
      </div>

      <div className="mt-5">
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            {from}
          </span>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full h-12 rounded-xl border border-border bg-background pl-14 pr-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-ring/40 transition-shadow"
          />
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-muted/60 px-4 py-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Converted amount</span>
          {latestRate != null && !loading && (
            <span>1 {from} = {formatNumber(latestRate)} {to}</span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight">{to}</span>
          <span className="text-2xl font-semibold tabular-nums">
            {loading ? '…' : formatNumber(converted)}
          </span>
        </div>
      </div>

      <Button onClick={onSave} className="w-full mt-4" disabled={loading || converted == null}>
        Save to history
      </Button>
    </div>
  );
}