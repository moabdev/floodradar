"use client"

import { useEffect, useState } from "react"
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
  SimPointVariavel,
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

// -------------------------------------------
// TIPAGEM DOS COMPONENTES INTERNOS
// -------------------------------------------

type ParamProps = {
  label: string
  value: number
  min?: number
  explanation?: string
  setValue: (value: number) => void
}

type KpiProps = {
  title: string
  value: string
  highlight?: boolean
}

type TabButtonProps = {
  value: string
  label: string
}

type ChartTabProps = {
  value: string
  title: string
  children: React.ReactNode
}

type ExplainerProps = {
  children: React.ReactNode
}

// Helper para limpar texto numérico (0–9, . ,)
const NUMERIC_REGEX = /[^0-9.,]/g
function sanitizeNumericString(value: string): string {
  return value.replace(NUMERIC_REGEX, "")
}

// -------------------------------------------
// PÁGINA PRINCIPAL
// -------------------------------------------

export default function SimulacaoVariavelPage() {
  const [horas, setHoras] = useState<number>(6)
  const [chuva, setChuva] = useState<string[]>(Array(6).fill("0"))

  const [Dmax, setDmax] = useState<number>(15)
  const [Amax, setAmax] = useState<number>(120)
  const [A0, setA0] = useState<number>(0)

  const [dados, setDados] = useState<SimPointVariavel[] | null>(null)

  // Atualizar nº de horas cria/remove inputs
  function atualizarHoras(n: number) {
    if (n <= 0 || !Number.isFinite(n)) return

    setHoras(n)
    setChuva(prev => {
      const arr = [...prev]
      while (arr.length < n) arr.push("0")
      while (arr.length > n) arr.pop()
      return arr
    })
  }

  // Toast baseado no risco final
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

  // Rodar simulação
  function handleSimular() {
    const chuvaNumerica = chuva.map(v => {
      const normalized = v.replace(",", ".")
      const num = parseFloat(normalized)
      return Number.isFinite(num) ? num : 0
    })

    const sim = rodarSimulacaoAvancadaVariavel({
      chuva: chuvaNumerica,
      D_max: Dmax,
      A_max: Amax,
      A0,
    })

    const riscoFinal = sim.at(-1)?.risco ?? 0
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

      {/* PAINEL DE PARÂMETROS */}
      <Card>
        <CardHeader>
          <CardTitle>Configuração da Simulação</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Parâmetros principais */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <Param label="Drenagem Dₘₐₓ (mm/h)" value={Dmax} setValue={setDmax} />
            <Param label="Capacidade Aₘₐₓ (mm)" value={Amax} setValue={setAmax} />
            <Param label="Acúmulo inicial A₀ (mm)" value={A0} setValue={setA0} />
            <Param
              label="Duração (h)"
              value={horas}
              min={1}
              setValue={(v) => atualizarHoras(v)}
            />
          </div>

          {/* Campos dinâmicos de chuva */}
          <div className="space-y-2">
            <Label>Chuva hora a hora (mm)</Label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {chuva.map((valor, i) => (
                <Input
                  key={i}
                  type="text"
                  inputMode="decimal"
                  value={valor}
                  onChange={(e) => {
                    const clean = sanitizeNumericString(e.target.value)
                    const novo = [...chuva]
                    novo[i] = clean
                    setChuva(novo)
                  }}
                />
              ))}
            </div>
          </div>

          <Button
            onClick={handleSimular}
            className={cn(
              "w-full py-4 text-lg font-semibold tracking-wide rounded-xl",
              "transition-all duration-300 bg-linear-to-r from-blue-600 to-blue-500",
              "hover:from-blue-500 hover:to-blue-400 hover:shadow-lg hover:shadow-blue-500/20",
              "active:scale-95 active:shadow-inner text-white shadow-md",
            )}
          >
            Rodar Simulação
          </Button>
        </CardContent>
      </Card>

      {/* RESULTADOS COM GRÁFICOS */}
      {dados && ultimo && (
        <>
          <Separator />

          {/* KPIs */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Kpi title="Nível final" value={`${ultimo.A.toFixed(1)} mm`} />
            <Kpi title="Derivada final" value={`${ultimo.dA.toFixed(1)} mm/h`} />
            <Kpi
              title="Risco final"
              value={`${ultimo.risco.toFixed(0)} %`}
              highlight={ultimo.risco >= 70}
            />
          </section>

          <Separator />

          {/* ABAS */}
          <Tabs defaultValue="acumulo" className="w-full">
            <TabsList className="flex w-full justify-center gap-4 flex-wrap">
              <TabButton value="acumulo" label="A(t)" />
              <TabButton value="derivada" label="A′(t)" />
              <TabButton value="intD" label="I × D" />
              <TabButton value="risco" label="Risco" />
            </TabsList>

            {/* A(t) */}
            <ChartTab value="acumulo" title="Acúmulo de Água A(t)">
              <ChartAcumuloAgua data={dados.map(p => ({ t: p.t, A: p.A }))} />
              <Explainer>
                <Latex value={"A(t) = A(t-1) + \\max(0, I(t) - D_{max})"} />
              </Explainer>
            </ChartTab>

            {/* Derivada */}
            <ChartTab value="derivada" title="Derivada A′(t)">
              <ChartDerivada data={dados.map(p => ({ t: p.t, dA: p.dA }))} />
              <Explainer>
                <Latex value={"A'(t) = A(t) - A(t-1)"} />
              </Explainer>
            </ChartTab>

            {/* Entrada × Drenagem */}
            <ChartTab value="intD" title="Entrada vs Drenagem">
              <ChartIntensidadeDrenagem
                data={dados.map(p => ({ t: p.t, I: p.I, D: p.D_efetiva }))}
              />
            </ChartTab>

            {/* Risco */}
            <ChartTab value="risco" title="Risco ao longo do tempo">
              <ChartRisco data={dados.map(p => ({ t: p.t, risco: p.risco }))} />
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

// -------------------------------------------
// COMPONENTES AUXILIARES TIPADOS
// -------------------------------------------

function Param({ label, value, min, explanation, setValue }: ParamProps) {
  const [input, setInput] = useState<string>(String(value))

  // sincroniza quando o value externo mudar (ex: reset)
  useEffect(() => {
    setInput(String(value))
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    const clean = sanitizeNumericString(raw)
    setInput(clean)

    if (clean === "") {
      return
    }

    const normalized = clean.replace(",", ".")
    const parsed = parseFloat(normalized)
    if (!Number.isNaN(parsed)) {
      if (min !== undefined && parsed < min) {
        setValue(min)
      } else {
        setValue(parsed)
      }
    }
  }

  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input
        type="text"
        inputMode="decimal"
        value={input}
        onChange={handleChange}
      />
      {explanation && (
        <p className="text-xs text-muted-foreground">{explanation}</p>
      )}
    </div>
  )
}

function Kpi({ title, value, highlight }: KpiProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn("text-3xl font-semibold", highlight && "text-red-500")}>
          {value}
        </p>
      </CardContent>
    </Card>
  )
}

function TabButton({ value, label }: TabButtonProps) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        "px-5 py-2 rounded-lg text-sm font-semibold",
        "bg-slate-800/40 border border-slate-700/40",
        "data-[state=active]:bg-blue-600 data-[state=active]:text-white",
        "transition-all duration-200",
      )}
    >
      {label}
    </TabsTrigger>
  )
}

function ChartTab({ value, title, children }: ChartTabProps) {
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

function Explainer({ children }: ExplainerProps) {
  return (
    <div className="p-4 bg-slate-700/30 border border-slate-500/40 rounded-lg text-sm space-y-2">
      {children}
    </div>
  )
}
