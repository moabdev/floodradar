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

export function ChartDerivada({ data }: { data: SimPoint[] }) {
  const chartData = data.map((p) => ({
    time: `${p.t} h`,
    dA: p.dA,
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="dA"
          stroke="var(--chart-2, #22c55e)"
          strokeWidth={2}
          dot
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
