"use client"

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

export function ChartRisco({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="t" stroke="var(--foreground)" />
        <YAxis stroke="var(--foreground)" domain={[0, 100]} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="risco"
          name="Risco (%)"
          stroke="#dc2626"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
