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
import { toast } from "sonner"

type ParamProps = {
  label: string
  value: number
  min?: number
  setValue: (value: number) => void
}

export default function SimulacaoVariavelPage() {
  const [horas, setHoras] = useState(6)
  const [chuva, setChuva] = useState<string[]>(Array(6).fill("0"))

  const [Dmax, setDmax] = useState(15)
  const [Amax, setAmax] = useState(120)
  const [A0, setA0] = useState(0)

  const [dados, setDados] = useState<SimPointVariavel[] | null>(null)

  function atualizarHoras(n: number) {
    setHoras(n)
    setChuva(prev => {
      const novo = [...prev]
      while (novo.length < n) novo.push("0")
      while (novo.length > n) novo.pop()
      return novo
    })
  }

  function toastRisco(riscoFinal: number) {
    if (riscoFinal >= 70) {
      toast("Risco Alto 🌧️", {
        description: `O risco atingiu ${riscoFinal.toFixed(0)}%. Atenção máxima!`,
        className: "bg-red-600 text-white shadow-red-400",
      })
    } else if (riscoFinal >= 40) {
      toast("Risco Moderado 🌦️", {
        description: `Risco atual: ${riscoFinal.toFixed(0)}%. Mantenha atenção.`,
        className: "bg-yellow-500 text-black shadow-yellow-300",
      })
    } else {
      toast("Risco Baixo 🌿", {
        description: `Risco atual: ${riscoFinal.toFixed(0)}%. Sistema estável.`,
        className: "bg-green-600 text-white shadow-green-400",
      })
    }
  }

  function handleSimular() {
    const chuvaNum = chuva.map(Number)

    const sim = rodarSimulacaoAvancadaVariavel({
      chuva: chuvaNum,
      D_max: Dmax,
      A_max: Amax,
      A0,
    })

    const riscoFinal = sim.at(-1)!.risco
    toastRisco(riscoFinal)

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

          {/* PARÂMETROS PRINCIPAIS */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <Param label="Drenagem Dₘₐₓ (mm/h)" value={Dmax} setValue={setDmax} />
            <Param label="Capacidade Aₘₐₓ (mm)" value={Amax} setValue={setAmax} />
            <Param label="Acúmulo inicial A₀ (mm)" value={A0} setValue={setA0} />
            <Param label="Duração (h)" value={horas} min={1} setValue={v => atualizarHoras(Number(v))} />
          </div>

          {/* CHUVA HORA-A-HORA */}
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

          {/* BOTÃO */}
          <Button
            onClick={handleSimular}
            className={cn(
              "w-full py-4 text-lg font-semibold tracking-wide rounded-xl",
              "transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-500",
              "hover:from-blue-500 hover:to-blue-400 hover:shadow-lg hover:shadow-blue-500/20",
              "active:scale-95 active:shadow-inner text-white shadow-md"
            )}
          >
            Rodar Simulação
          </Button>
        </CardContent>
      </Card>

      {/* RESULTADOS */}
      {dados && ultimo && (
        <>
          <Separator />

          {/* KPIS */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Kpi title="Nível final" value={`${ultimo.A.toFixed(1)} mm`} />
            <Kpi title="Derivada final" value={`${ultimo.dA.toFixed(1)} mm/h`} />
            <Kpi title="Risco final" value={`${ultimo.risco.toFixed(0)} %`} highlight={ultimo.risco >= 70} />
          </section>

          <Separator />

          {/* TABS — PADRÃO SHADCN SEM BUG DE ALTURA */}
          <Tabs defaultValue="acumulo" className="w-full">

            <TabsList className="w-full justify-center gap-4">
              <TabsTrigger value="acumulo">A(t)</TabsTrigger>
              <TabsTrigger value="derivada">A′(t)</TabsTrigger>
              <TabsTrigger value="intD">I × D</TabsTrigger>
              <TabsTrigger value="risco">Risco</TabsTrigger>
            </TabsList>

            {/* A(t) */}
            <TabsContent value="acumulo">
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Acúmulo de Água A(t)</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <ChartAcumuloAgua data={dados.map(p => ({ t: p.t, A: p.A }))} />
                    <Explainer>
                      <Latex value={"A(t) = A(t-1) + \\max(0, I(t) - D_{max})"} />
                    </Explainer>
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Derivada */}
            <TabsContent value="derivada">
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Derivada A′(t)</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <ChartDerivada data={dados.map(p => ({ t: p.t, dA: p.dA }))} />
                    <Explainer>
                      <Latex value={"A'(t) = A(t) - A(t-1)"} />
                    </Explainer>
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Entrada vs Drenagem */}
            <TabsContent value="intD">
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Entrada vs Drenagem</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <ChartIntensidadeDrenagem data={dados.map(p => ({ t: p.t, I: p.I, D: p.D_efetiva }))} />
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Risco */}
            <TabsContent value="risco">
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Risco ao longo do tempo</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <ChartRisco data={dados.map(p => ({ t: p.t, risco: p.risco }))} />
                    <Explainer>
                      <Latex value={"R(t) = 100 \\cdot \\frac{A(t)}{A_{max}}"} />
                    </Explainer>
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </>
      )}

    </div>
  )
}

/* ======================================================================================
   COMPONENTES AUXILIARES
====================================================================================== */

function Param({ label, value, setValue, min }: ParamProps) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input type="number" min={min} value={value} onChange={e => setValue(Number(e.target.value))} />
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

function Explainer({ children }: any) {
  return (
    <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 text-sm space-y-2">
      {children}
    </div>
  )
}
