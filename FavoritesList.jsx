import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Star, X } from 'lucide-react';
import { CURRENCY_MAP } from '@/lib/currencies';

export default function FavoritesList({ currentPair, onSelect }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await base44.entities.Favorite.list('-created_date', 50);
      setFavorites(res);
    } catch (e) {
      // ignore
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    setFavorites((f) => f.filter((x) => x.id !== id));
    try { await base44.entities.Favorite.delete(id); } catch (e) {}
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-4 h-4 text-amber-500" />
        <h2 className="text-lg font-semibold tracking-tight">Favorites</h2>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : favorites.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No favorites yet. Add a currency pair from the converter to see it here.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {favorites.map((f) => {
            const active =
              currentPair &&
              currentPair.from === f.from_currency &&
              currentPair.to === f.to_currency;
            return (
              <div
                key={f.id}
                className={`group inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:bg-muted'
                }`}
              >
                <button
                  onClick={() => onSelect(f.from_currency, f.to_currency)}
                  className="flex items-center gap-1.5 font-medium"
                >
                  <span>{CURRENCY_MAP[f.from_currency]?.flag}</span>
                  <span>{f.from_currency}</span>
                  <span className="opacity-50">→</span>
                  <span>{CURRENCY_MAP[f.to_currency]?.flag}</span>
                  <span>{f.to_currency}</span>
                </button>
                <button
                  onClick={() => remove(f.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove favorite"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}