"use client"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

export function ChartAcumuloAgua({
  data,
  explicito,
}: {
  data: any[]
  explicito?: boolean
}) {
  return (
    <div className="space-y-3">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 4" opacity={0.3} />
          <XAxis dataKey="t" tickFormatter={v => `${v}h`} />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="A"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-xs text-muted-foreground leading-relaxed">
        O acúmulo <strong>A(t)</strong> começa no valor inicial{" "}
        <strong>A₀</strong> em <strong>t = 0</strong>. Ele passa a crescer a
        partir de <strong>t = 1</strong>, quando a primeira hora de chuva entra
        no sistema. Usamos a relação{" "}
        <strong>A(t) = A(t−1) + max(0, I(t−1) − Dmax)</strong>.
      </p>
    </div>
  )
}
