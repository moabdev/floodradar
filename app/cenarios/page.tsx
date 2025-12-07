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

    setDados(series)

    const analises = series.map(analisarCenario)
    const comparacao = compararCenarios(analises)

    setResumo(comparacao)
  }

  return (
    <div className="space-y-16 pb-20">
      <h1 className="text-4xl font-bold tracking-tight">
        Cenários de Chuva Variável
      </h1>

      {/* PARÂMETROS GERAIS */}
      <Card>
        <CardHeader>
          <CardTitle>Parâmetros dos Cenários</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-3">
              <Label>Duração (horas)</Label>
              <Input
                type="number"
                min={1}
                value={horas}
                onChange={e => atualizarHoras(Number(e.target.value))}
              />
            </div>

            <div className="space-y-3">
              <Label>Amax</Label>
              <Input
                type="number"
                value={Amax}
                onChange={e => setAmax(Number(e.target.value))}
              />
            </div>

            <div className="space-y-3">
              <Label>A0</Label>
              <Input
                type="number"
                value={A0}
                onChange={e => setA0(Number(e.target.value))}
              />
            </div>
          </div>

          {/* PARÂMETROS POR CENÁRIO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {chuva.map((cenario, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <h2 className="font-semibold">Cenário {i + 1}</h2>

                <Label>Chuva I(t) hora a hora</Label>
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
              </div>
            ))}
          </div>

          <Button className="w-full py-5 text-lg" onClick={simular}>
            Rodar Cenários
          </Button>
        </CardContent>
      </Card>

      {/* RELATÓRIO GERAL */}
      {resumo && (
        <Card>
          <CardHeader>
            <CardTitle>Relatório de Comparação</CardTitle>
          </CardHeader>

          <CardContent className="text-lg space-y-3">
            <p>
              🔥 Cenário mais perigoso:
              <strong> Cenário {resumo.ranking[0] + 1}</strong>
            </p>

            <p>
              🌧️ Maior risco registrado:
              <strong> {resumo.maisPerigoso.riscoMax.toFixed(1)}%</strong>
            </p>

            <p>
              📊 Diferença entre os dois piores:
              <strong> {resumo.diferencas.entre1e2.toFixed(1)}%</strong>
            </p>
          </CardContent>
        </Card>
      )}

      {/* ABAS DOS CENÁRIOS */}
      {dados.length > 0 && (
        <Tabs defaultValue="0" className="w-full">
          <TabsList className="w-full flex justify-center gap-2 bg-transparent">
            {dados.map((_, i) => {
              const icone = i === 0 ? "🌧️" : i === 1 ? "⚠️" : "💧"

              return (
                <TabsTrigger
                  key={i}
                  value={String(i)}
                  className={cn(
                    "px-6 py-3 text-lg font-medium rounded-xl transition-all",
                    "data-[state=active]:bg-blue-600 data-[state=active]:text-white",
                    "data-[state=inactive]:bg-blue-100 data-[state=inactive]:text-blue-700",
                    "hover:scale-105 hover:shadow-md",
                  )}
                >
                  {icone} Cenário {i + 1}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {dados.map((serie, i) => (
            <TabsContent key={i} value={String(i)}>
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="w-full mt-6 shadow-lg rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      {i === 0 && "🌧️"}
                      {i === 1 && "⚠️"}
                      {i === 2 && "💧"}
                      Cenário {i + 1}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* RESUMO INDIVIDUAL */}
                    {resumo?.cenarios[i] && (
                      <div className="p-4 bg-slate-650 rounded-lg border border-blue-200">
                        <h3 className="text-xl font-semibold mb-2">
                          Resumo do Cenário
                        </h3>
                        <p>
                          <strong>Risco Máximo:</strong>{" "}
                          {resumo.cenarios[i].riscoMax.toFixed(1)}%
                        </p>
                        <p>
                          <strong>Acúmulo Máximo:</strong>{" "}
                          {resumo.cenarios[i].acumuloMax.toFixed(1)} mm
                        </p>
                        <p>
                          <strong>Drenagem Máx.:</strong>{" "}
                          {resumo.cenarios[i].drenagemMax.toFixed(1)} mm/h
                        </p>
                      </div>
                    )}

                    {/* GRÁFICOS */}
                    <ChartAcumuloAgua data={serie} />
                    <ChartRisco data={serie} />
                    <ChartIntensidadeDrenagem data={serie} />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
