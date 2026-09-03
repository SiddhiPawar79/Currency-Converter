import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function fmtDate(d) {
  const date = new Date(d);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function fmtRate(n) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

export default function TrendChart({ history, from, to, loading }) {
  const data = history.map((h) => ({ date: h.date, rate: h.rate }));
  const min = data.length ? Math.min(...data.map((d) => d.rate)) : 0;
  const max = data.length ? Math.max(...data.map((d) => d.rate)) : 1;
  const pad = (max - min) * 0.1 || 0.001;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">30-Day Trend</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{from} → {to}</p>
        </div>
        {data.length > 0 && (
          <div className="text-right text-xs text-muted-foreground">
            <div>Low {fmtRate(min)}</div>
            <div>High {fmtRate(max)}</div>
          </div>
        )}
      </div>

      <div className="h-64 w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            Loading chart…
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="rateStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={fmtDate}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                minTickGap={28}
              />
              <YAxis
                domain={[min - pad, max + pad]}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                width={56}
                tickFormatter={fmtRate}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid hsl(var(--border))',
                  fontSize: 12
                }}
                labelFormatter={(d) => fmtDate(d)}
                formatter={(v) => [fmtRate(v), 'Rate']}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="url(#rateStroke)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}