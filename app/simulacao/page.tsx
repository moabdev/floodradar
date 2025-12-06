"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
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
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Simulação</h1>
        <p className="text-muted-foreground max-w-2xl">
          Ajuste intensidade de chuva I(t), capacidade de drenagem D(t) e
          duração da chuva. O modelo calcula o acúmulo A(t), a derivada A′(t)
          e um indicador de risco hidrológico.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Parâmetros da simulação</CardTitle>
          <CardDescription>
            Valores em mm/h e horas. Não há persistência: tudo acontece localmente no navegador.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Intensidade da chuva I(t)</Label>
            <Input
              type="number"
              value={I}
              onChange={(e) => setI(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Drenagem D(t)</Label>
            <Input
              type="number"
              value={D}
              onChange={(e) => setD(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Duração (horas)</Label>
            <Input
              type="number"
              min={1}
              value={horas}
              onChange={(e) => setHoras(Number(e.target.value))}
            />
          </div>

          <div className="sm:col-span-3">
            <Button className="w-full" onClick={handleSimular}>
              Rodar simulação
            </Button>
          </div>
        </CardContent>
      </Card>

      {dados && ultimo && (
        <>
          <Separator />

          {/* KPIs */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Kpi title="Nível final A(t)" value={`${ultimo.A.toFixed(1)} mm`} />
            <Kpi title="Derivada final A′(t)" value={`${ultimo.dA.toFixed(1)} mm/h`} />
            <Kpi title="Risco final" value={`${ultimo.risco.toFixed(0)} %`} />
          </section>

          <Separator />

          {/* Gráficos principais */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Intensidade × Drenagem">
              <ChartIntensidadeDrenagem data={dados} />
            </ChartCard>

            <ChartCard title="Derivada A′(t)">
              <ChartDerivada data={dados} />
            </ChartCard>
          </section>

          <section>
            <ChartCard title="Acúmulo A(t)">
              <ChartAcumuloAgua data={dados} />
            </ChartCard>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Radar de risco">
              <ChartRadar value={ultimo.risco} />
            </ChartCard>

            <ChartCard title="Risco ao longo do tempo">
              <ChartRisco data={dados} />
            </ChartCard>
          </section>
        </>
      )}
    </div>
  )
}

function Kpi({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  )
}

function ChartCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full max-w-full overflow-hidden">{children}</div>
      </CardContent>
    </Card>
  )
}
