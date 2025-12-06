"use client"

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts"

export function ChartRadar({ value }: { value: number }) {
  const chartData = [
    {
      name: "Risco",
      risco: value,
      fill:
        value >= 70
          ? "var(--chart-3, #ef4444)"
          : value >= 40
          ? "var(--chart-2, #f59e0b)"
          : "var(--chart-1, #22c55e)",
    },
  ]

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="60%"
        outerRadius="100%"
        barSize={18}
        startAngle={180}
        endAngle={0}
        data={chartData}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          dataKey="risco"
          tick={false}
        />
        <RadialBar background dataKey="risco" cornerRadius={10} />
        {/* valor no centro */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground text-2xl font-bold"
        >
          {value.toFixed(0)}%
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  )
}
