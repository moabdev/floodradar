"use client"

import { SimPoint } from "@/lib/simulador"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export function ChartRisco({ data }: { data: SimPoint[] }) {
  const chartData = data.map((p) => ({
    time: `${p.t} h`,
    risco: p.risco,
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="risco"
          stroke="var(--chart-3, #ef4444)"
          strokeWidth={2}
          dot
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
