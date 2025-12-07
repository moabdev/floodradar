"use client"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts"

export function ChartIntensidadeDrenagem({ data }: { data: any[] }) {
  return (
    <div className="space-y-3">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 4" opacity={0.3} />
          <XAxis dataKey="t" tickFormatter={v => `${v}h`} />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="I"
            name="Chuva I(t)"
            stroke="#0ea5e9"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="D"
            name="Drenagem Dmax"
            stroke="#f97316"
            strokeWidth={3}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-xs text-muted-foreground leading-relaxed">
        A chuva <strong>I(t)</strong> representa a intensidade aplicada em cada
        passo, enquanto a drenagem é limitada por um valor constante{" "}
        <strong>Dmax</strong>. Sempre que I(t) fica acima de Dmax, o excedente
        contribui para o acúmulo A(t+1).
      </p>
    </div>
  )
}
