"use client"

import { SimPoint } from "@/lib/simulador"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export function ChartAcumuloAgua({ data }: { data: SimPoint[] }) {
  const chartData = data.map((p) => ({
    time: `${p.t} h`,
    A: p.A,
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="A"
          stroke="var(--chart-1, #3b82f6)"
          fill="var(--chart-1, #3b82f6)"
          fillOpacity={0.2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
