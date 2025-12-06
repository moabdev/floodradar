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
  Legend,
} from "recharts"

export function ChartIntensidadeDrenagem({ data }: { data: SimPoint[] }) {
  const chartData = data.map((p) => ({
    time: `${p.t} h`,
    I: p.I,
    D: p.D,
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="I"
          name="Intensidade I(t)"
          stroke="var(--chart-1, #3b82f6)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="D"
          name="Drenagem D(t)"
          stroke="var(--chart-2, #22c55e)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
