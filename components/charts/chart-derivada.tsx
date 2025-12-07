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

export function ChartDerivada({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="t" stroke="var(--foreground)" />
        <YAxis stroke="var(--foreground)" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="dA"
          name="A′(t)"
          stroke="#ef4444"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
