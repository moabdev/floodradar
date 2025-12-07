"use client"

import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import {
  rodarSimulacaoAvancadaVariavel,
  SimPointVariavel
} from "@/lib/simulador-variavel"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import { ChartIntensidadeDrenagem } from "@/components/charts/chart-intensidade-drenagem"
import { ChartAcumuloAgua } from "@/components/charts/chart-acumulo"
import { ChartDerivada } from "@/components/charts/chart-derivada"
import { ChartRisco } from "@/components/charts/chart-risco"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Latex } from "@/components/latex/Latex"


export default function SimulacaoVariavelPage() {
  const [horas, setHoras] = useState(6)
  const [chuva, setChuva] = useState<string[]>(Array(6).fill("0"))

  const [Dmax, setDmax] = useState(15)
  const [Amax, setAmax] = useState(120)
  const [A0, setA0] = useState(0)

  const [dados, setDados] = useState<SimPointVariavel[] | null>(null)

  // Atualizar número de horas → cria / remove campos de chuva
  function atualizarHoras(n: number) {
    setHoras(n)
    setChuva((prev) => {
      const novo = [...prev]
      while (novo.length < n) novo.push("0")
      while (novo.length > n) novo.pop()
      return novo
    })
  }

  // RODAR SIMULAÇÃO
  function handleSimular() {
    const chuvaNumerica = chuva.map(Number)

    const sim = rodarSimulacaoAvancadaVariavel({
      chuva: chuvaNumerica,
      D_max: Dmax,
      A_max: Amax,
      A0,
    })

    setDados(sim)
  }

  const ultimo = dados?.[dados.length - 1]

  return (
    <div className="space-y-16 pb-20">

      {/* TÍTULO */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Simulação Hidrológica com Chuva Variável
        </h1>

        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          Defina a chuva hora a hora: <Latex inline value={"I(t)"} />.
          O modelo aplica drenagem limitada e calcula acúmulo, derivada e risco.
        </p>
      </section>

      {/* PARÂMETROS */}
      <Card>
        <CardHeader>
          <CardTitle>Configuração da Simulação</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Linha de parâmetros principais */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <Param label="Drenagem Dₘₐₓ (mm/h)" value={Dmax} set={setDmax} />
            <Param label="Capacidade Aₘₐₓ (mm)" value={Amax} set={setAmax} />
            <Param label="Acúmulo inicial A₀ (mm)" value={A0} set={setA0} />
            <Param label="Duração (h)" value={horas} set={n => atualizarHoras(n)} min={1} />
          </div>

          {/* Campos dinâmicos de chuva */}
          <div className="space-y-2">
            <Label>Chuva hora a hora (mm)</Label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {chuva.map((valor, i) => (
                <Input
                  key={i}
                  type="number"
                  value={valor}
                  onChange={(e) => {
                    const novo = [...chuva]
                    novo[i] = e.target.value
                    setChuva(novo)
                  }}
                />
              ))}
            </div>
          </div>

          <Button className="w-full py-4 text-lg" onClick={handleSimular}>
            Rodar Simulação
          </Button>
        </CardContent>
      </Card>

      {/* RESULTADOS */}
      {dados && ultimo && (
        <>
          <Separator />

          {/* KPIs */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Kpi title="Nível final" value={`${ultimo.A.toFixed(1)} mm`} />
            <Kpi title="Derivada final" value={`${ultimo.dA.toFixed(1)} mm/h`} />
            <Kpi title="Risco final" value={`${ultimo.risco.toFixed(0)} %`} highlight={ultimo.risco >= 70} />
          </section>

          <Separator />

          {/* ABAS DOS GRÁFICOS */}
          <Tabs defaultValue="acumulo" className="w-full">
            <TabsList className="w-full flex-wrap justify-center gap-2">
              <TabButton value="acumulo" label="A(t)" />
              <TabButton value="derivada" label="A′(t)" />
              <TabButton value="intD" label="I × D" />
              <TabButton value="risco" label="Risco" />
              <TabButton value="radar" label="Radar" />
            </TabsList>

            {/* A(t) */}
            <ChartTab value="acumulo" title="Acúmulo de Água A(t)">
              <ChartAcumuloAgua data={dados.map((p) => ({ t: p.t, A: p.A }))} />
              <Explainer>
                <Latex value={"A(t) = A(t-1) + \\max(0, I(t) - D_{max})"} />
              </Explainer>
            </ChartTab>

            {/* Derivada */}
            <ChartTab value="derivada" title="Derivada A′(t)">
              <ChartDerivada data={dados.map((p) => ({ t: p.t, dA: p.dA }))} />
              <Explainer>
                <Latex value={"A'(t) = A(t) - A(t-1)"} />
              </Explainer>
            </ChartTab>

            {/* Entrada vs Drenagem */}
            <ChartTab value="intD" title="Entrada vs Drenagem">
              <ChartIntensidadeDrenagem
                data={dados.map((p) => ({
                  t: p.t,
                  I: p.I,
                  D: p.D_efetiva,
                }))}
              />
            </ChartTab>

            {/* Risco */}
            <ChartTab value="risco" title="Risco ao longo do tempo">
              <ChartRisco data={dados.map((p) => ({ t: p.t, risco: p.risco }))} />
              <Explainer>
                <Latex value={"R(t) = 100 \\cdot \\frac{A(t)}{A_{max}}"} />
              </Explainer>
            </ChartTab>
          </Tabs>
        </>
      )}
    </div>
  )
}


/* -----------------------------------
   COMPONENTES AUXILIARES
------------------------------------ */

function Param({ label, value, set, explanation, min }: any) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input type="number" value={value} min={min} onChange={(e) => set(Number(e.target.value))} />
      {explanation && <p className="text-xs text-muted-foreground">{explanation}</p>}
    </div>
  )
}

function Kpi({ title, value, highlight }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn("text-3xl font-semibold", highlight && "text-red-500")}>{value}</p>
      </CardContent>
    </Card>
  )
}

function TabButton({ value, label }: any) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        "px-4 py-2 rounded-lg text-sm font-medium",
        "data-[state=active]:bg-blue-600 data-[state=active]:text-white",
        "data-[state=inactive]:bg-blue-100 data-[state=inactive]:text-blue-700",
        "transition-all hover:scale-105"
      )}
    >
      {label}
    </TabsTrigger>
  )
}

function ChartTab({ value, title, children }: any) {
  return (
    <TabsContent value={value}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">{children}</CardContent>
        </Card>
      </motion.div>
    </TabsContent>
  )
}

function Explainer({ children }: any) {
  return (
    <div className="p-4 bg-slate-650 border border-white-200 rounded-lg text-sm space-y-2">
      {children}
    </div>
  )
}
