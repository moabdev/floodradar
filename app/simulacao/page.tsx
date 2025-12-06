"use client"

import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import { rodarSimulacao, SimPoint } from "@/lib/simulador"

import { ChartIntensidadeDrenagem } from "@/components/charts/chart-intensidade-drenagem"
import { ChartAcumuloAgua } from "@/components/charts/chart-acumulo"
import { ChartDerivada } from "@/components/charts/chart-derivada"
import { ChartRisco } from "@/components/charts/chart-risco"
import { ChartRadar } from "@/components/charts/chart-radar"

export default function SimulacaoPage() {
  const [I, setI] = useState(12)
  const [D, setD] = useState(7)
  const [horas, setHoras] = useState(4)
  const [dados, setDados] = useState<SimPoint[] | null>(null)

  function handleSimular() {
    const sim = rodarSimulacao(I, D, horas)
    setDados(sim)
  }

  const ultimo = dados?.[dados.length - 1]

  return (
    <div className="space-y-14">

      {/* INTRODUÇÃO */}
      <section className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">
          Simulação Hidrológica
        </h1>

        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          Explore como chuva, drenagem e tempo de exposição influenciam o 
          comportamento hidrológico de uma região. O modelo utiliza 
          <span className="font-medium"> Cálculo I </span> para estimar acúmulo{" "}
          <strong>A(t)</strong>, derivada <strong>A′(t)</strong> e{" "}
          <strong>nível de risco</strong>.
        </p>
      </section>

      {/* PARÂMETROS */}
      <Card>
        <CardHeader>
          <CardTitle>Parâmetros da Simulação</CardTitle>
          <CardDescription>
            Insira valores em mm/h e horas. Os cálculos são instantâneos e rodados localmente.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Intensidade */}
          <div className="space-y-2">
            <Label>Intensidade da chuva I(t)</Label>
            <Input
              type="number"
              value={I}
              onChange={(e) => setI(Number(e.target.value))}
            />
          </div>

          {/* Drenagem */}
          <div className="space-y-2">
            <Label>Drenagem D(t)</Label>
            <Input
              type="number"
              value={D}
              onChange={(e) => setD(Number(e.target.value))}
            />
          </div>

          {/* Duração */}
          <div className="space-y-2">
            <Label>Duração (horas)</Label>
            <Input
              type="number"
              min={1}
              value={horas}
              onChange={(e) => setHoras(Number(e.target.value))}
            />
          </div>

          {/* BOTÃO */}
          <div className="sm:col-span-3 pt-2">
            <Button className="w-full text-base py-5" onClick={handleSimular}>
              Rodar Simulação
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* RESULTADOS */}
      {dados && ultimo && (
        <>
          <Separator className="my-10" />

          {/* MÉTRICAS PRINCIPAIS */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Kpi title="Nível final A(t)" value={`${ultimo.A.toFixed(1)} mm`} />

            <Kpi title="Derivada final A′(t)" value={`${ultimo.dA.toFixed(1)} mm/h`} />

            <Kpi
              title="Risco final"
              value={`${ultimo.risco.toFixed(0)} %`}
              highlight={ultimo.risco >= 70}
            />
          </section>

          <Separator className="my-10" />

          {/* GRÁFICOS — primeira linha */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Intensidade × Drenagem"
              description="Comparação direta entre I(t) e D(t)"
            >
              <ChartIntensidadeDrenagem data={dados} />
            </ChartCard>

            <ChartCard
              title="Derivada A′(t)"
              description="Mostra tendência de crescimento ou redução do nível"
            >
              <ChartDerivada data={dados} />
            </ChartCard>
          </section>

          {/* ACÚMULO */}
          <section>
            <ChartCard
              title="Acúmulo A(t)"
              description="Evolução do volume acumulado ao longo do tempo"
            >
              <ChartAcumuloAgua data={dados} />
            </ChartCard>
          </section>

          {/* RISCO */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Radar de risco"
              description="Representação visual circular do risco final"
            >
              <ChartRadar value={ultimo.risco} />
            </ChartCard>

            <ChartCard
              title="Risco ao longo do tempo"
              description="Como o risco hidrológico evolui durante toda a chuva"
            >
              <ChartRisco data={dados} />
            </ChartCard>
          </section>
        </>
      )}
    </div>
  )
}

function Kpi({
  title,
  value,
  highlight,
}: {
  title: string
  value: string
  highlight?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={`text-3xl font-semibold ${
            highlight ? "text-red-500 dark:text-red-400" : ""
          }`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  )
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <div className="w-full max-w-full overflow-hidden">{children}</div>
      </CardContent>
    </Card>
  )
}
