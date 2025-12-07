"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  rodarSimulacaoAvancadaVariavel,
  SimPointVariavel,
} from "@/lib/simulador-variavel"

import { analisarCenario, compararCenarios } from "@/lib/comparador"

import { ChartAcumuloAgua } from "@/components/charts/chart-acumulo"
import { ChartRisco } from "@/components/charts/chart-risco"
import { ChartIntensidadeDrenagem } from "@/components/charts/chart-intensidade-drenagem"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function CenariosPage() {
  const [horas, setHoras] = useState(5)

  const [chuva, setChuva] = useState<string[][]>([
    ["12", "15", "20", "5", "0"],
    ["8", "10", "25", "30", "12"],
    ["20", "22", "18", "15", "10"],
  ])

  const [Dmax, setDmax] = useState<number[]>([10, 8, 12])
  const [Amax, setAmax] = useState(120)
  const [A0, setA0] = useState(10)

  const [dados, setDados] = useState<SimPointVariavel[][]>([])
  const [resumo, setResumo] = useState<any>(null)

  function atualizarHoras(n: number) {
    if (!Number.isFinite(n) || n < 1) return
    setHoras(n)

    setChuva(prev =>
      prev.map(cenario => {
        const novo = [...cenario]
        while (novo.length < n) novo.push("0")
        while (novo.length > n) novo.pop()
        return novo
      }),
    )
  }

  function simular() {
    const series = chuva.map((c, i) =>
      rodarSimulacaoAvancadaVariavel({
        chuva: c.map(Number),
        D_max: Dmax[i],
        A_max: Amax,
        A0,
      }),
    )

    toast("Simulação concluída ✔️", {
      description: "Os gráficos foram atualizados com os novos parâmetros.",
      duration: 3500,
    })

    setDados(series)

    const analises = series.map(analisarCenario)
    const comparacao = compararCenarios(analises)

    setResumo(comparacao)
  }

  return (
    <div className="space-y-16 pb-20">
      <h1 className="text-4xl font-bold tracking-tight">Cenários de Chuva Variável</h1>

      {/* PARÂMETROS */}
      <Card>
        <CardHeader>
          <CardTitle>Parâmetros dos Cenários</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Linha de parâmetros gerais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Param label="Duração (horas)" value={horas} setValue={n => atualizarHoras(Number(n))} />

            <Param label="Amax" value={Amax} setValue={setAmax} />
            <Param label="A0" value={A0} setValue={setA0} />
          </div>

          {/* PARÂMETROS DE CADA CENÁRIO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {chuva.map((cenario, i) => (
              <Card key={i} className="p-4 space-y-3 border">
                <h2 className="font-semibold">Cenário {i + 1}</h2>

                <Label>Chuva I(t)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {cenario.map((v, h) => (
                    <Input
                      key={h}
                      type="number"
                      value={v}
                      onChange={e => {
                        const arr = chuva.map(row => [...row])
                        arr[i][h] = e.target.value
                        setChuva(arr)
                      }}
                    />
                  ))}
                </div>

                <Label>Dmax</Label>
                <Input
                  type="number"
                  value={Dmax[i]}
                  onChange={e => {
                    const arr = [...Dmax]
                    arr[i] = Number(e.target.value)
                    setDmax(arr)
                  }}
                />
              </Card>
            ))}
          </div>

          {/* BOTÃO */}
          <Button
            onClick={simular}
            className={cn(
              "w-full py-4 text-lg font-semibold tracking-wide",
              "rounded-xl transition-all duration-300",
              "bg-gradient-to-r from-blue-600 to-blue-500",
              "hover:from-blue-500 hover:to-blue-400",
              "hover:shadow-lg hover:shadow-blue-500/20",
              "active:scale-95 active:shadow-inner",
              "text-white shadow-md"
            )}
          >
            Rodar Cenários
          </Button>
        </CardContent>
      </Card>

      {/* RELATÓRIO */}
      {resumo && (
        <Card>
          <CardHeader>
            <CardTitle>Relatório de Comparação</CardTitle>
          </CardHeader>
          <CardContent className="text-lg space-y-3">
            <p>🔥 Cenário mais perigoso: <strong>{resumo.ranking[0] + 1}</strong></p>

            <p>🌧️ Maior risco registrado: <strong>{resumo.maisPerigoso.riscoMax.toFixed(1)}%</strong></p>

            <p>📊 Diferença entre os dois piores: <strong>{resumo.diferencas.entre1e2.toFixed(1)}%</strong></p>
          </CardContent>
        </Card>
      )}

      {/* TABS — versão oficial shadcn, SEM BUG DE ALTURA */}
      {dados.length > 0 && (
        <Tabs defaultValue="0" className="w-full">

          <TabsList className="w-full flex justify-center gap-4">
            {dados.map((_, i) => (
              <TabsTrigger key={i} value={String(i)}>
                Cenário {i + 1}
              </TabsTrigger>
            ))}
          </TabsList>

          {dados.map((serie, i) => (
            <TabsContent key={i} value={String(i)}>
              <Card className="mt-6 shadow-xl rounded-xl">
                <CardHeader>
                  <CardTitle>Cenário {i + 1}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">

                  {/* ANIMAÇÃO INTERNA — CORRETO */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >

                    {/* RESUMO */}
                    {resumo?.cenarios[i] && (
                      <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                        <h3 className="text-xl font-semibold mb-2">Resumo do Cenário</h3>
                        <p><strong>Risco Máximo:</strong> {resumo.cenarios[i].riscoMax.toFixed(1)}%</p>
                        <p><strong>Acúmulo Máximo:</strong> {resumo.cenarios[i].acumuloMax.toFixed(1)} mm</p>
                        <p><strong>Drenagem Máx.:</strong> {resumo.cenarios[i].drenagemMax.toFixed(1)} mm/h</p>
                      </div>
                    )}

                    {/* GRÁFICOS */}
                    <ChartAcumuloAgua data={serie} />
                    <ChartRisco data={serie} />
                    <ChartIntensidadeDrenagem data={serie} />

                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}

        </Tabs>
      )}
    </div>
  )
}

/* ============================================
   COMPONENTES AUXILIARES
============================================ */

function Param({ label, value, setValue }: {
  label: string
  value: number
  setValue: (v: number) => void
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={e => setValue(Number(e.target.value))}
      />
    </div>
  )
}
