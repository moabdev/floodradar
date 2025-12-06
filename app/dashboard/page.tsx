import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

import { rodarSimulacao } from "@/lib/simulador"
import { ChartAcumuloAgua } from "@/components/charts/chart-acumulo"
import { ChartDerivada } from "@/components/charts/chart-derivada"
import { ChartRisco } from "@/components/charts/chart-risco"
import { ChartRadar } from "@/components/charts/chart-radar"
import { ChartIntensidadeDrenagem } from "@/components/charts/chart-intensidade-drenagem"

export default function DashboardPage() {
  // cenário fixo e explicado
  const data = rodarSimulacao(18, 7, 6)
  const ultimo = data[data.length - 1]

  const mediaRisco =
    data.reduce((acc, p) => acc + p.risco, 0) / data.length

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground max-w-2xl">
          Cenário de referência: chuva constante I = 18 mm/h, drenagem
          D = 7 mm/h e duração de 6 horas. Todos os gráficos e indicadores
          abaixo são derivados diretamente desse modelo.
        </p>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPI
          title="Nível final A(t)"
          description="Acúmulo ao final do evento"
          value={`${ultimo.A.toFixed(1)} mm`}
        />
        <KPI
          title="Derivada final A′(t)"
          description="Taxa de variação no último instante"
          value={`${ultimo.dA.toFixed(1)} mm/h`}
        />
        <KPI
          title="Risco final"
          description="Índice calculado a partir de A(t)"
          value={`${ultimo.risco.toFixed(0)} %`}
        />
        <KPI
          title="Risco médio"
          description="Média do risco ao longo do período"
          value={`${mediaRisco.toFixed(0)} %`}
        />
      </section>

      <Separator />

      {/* I x D / Derivada */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Intensidade × Drenagem"
          description="I(t) e D(t) constantes durante o evento"
        >
          <ChartIntensidadeDrenagem data={data} />
        </ChartCard>

        <ChartCard
          title="Derivada A′(t)"
          description="Taxa de variação do nível de água"
        >
          <ChartDerivada data={data} />
        </ChartCard>
      </section>

      {/* Acúmulo */}
      <section>
        <ChartCard
          title="Nível acumulado A(t)"
          description="Modelo linear de acúmulo a partir de I e D"
        >
          <ChartAcumuloAgua data={data} />
        </ChartCard>
      </section>

      {/* Radar + risco */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Radar de risco">
          <ChartRadar value={ultimo.risco} />
        </ChartCard>

        <ChartCard title="Risco ao longo do tempo">
          <ChartRisco data={data} />
        </ChartCard>
      </section>
    </div>
  )
}

function KPI({
  title,
  description,
  value,
}: {
  title: string
  description: string
  value: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">{value}</p>
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
        <CardTitle className="text-base">{title}</CardTitle>
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
