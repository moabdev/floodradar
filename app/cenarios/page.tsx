"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"

import { rodarSimulacao, SimPoint } from "@/lib/simulador"

import { ChartAcumuloAgua } from "@/components/charts/chart-acumulo"
import { ChartDerivada } from "@/components/charts/chart-derivada"
import { ChartRisco } from "@/components/charts/chart-risco"
import { ChartIntensidadeDrenagem } from "@/components/charts/chart-intensidade-drenagem"

export default function CenariosPage() {
  const [cenarios, setCenarios] = useState([
    { I: 12, D: 7, horas: 4, dados: null as SimPoint[] | null },
    { I: 18, D: 6, horas: 4, dados: null as SimPoint[] | null },
    { I: 25, D: 10, horas: 4, dados: null as SimPoint[] | null },
  ])

  function atualizarCampo(index: number, campo: string, valor: number) {
    const clone = [...cenarios]
    clone[index] = { ...clone[index], [campo]: valor }
    setCenarios(clone)
  }

  function rodarTodos() {
    const novos = cenarios.map((c) => ({
      ...c,
      dados: rodarSimulacao(c.I, c.D, c.horas),
    }))
    setCenarios(novos)
  }

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Modo Cenários</h1>
        <p className="text-muted-foreground max-w-2xl">
          Compare até três cenários hidrológicos simultaneamente, alterando intensidade de chuva,
          drenagem e duração. O objetivo é avaliar a sensibilidade do modelo e entender como pequenas
          mudanças nos parâmetros afetam o risco final.
        </p>
      </section>

      {/* Formulário dos três cenários */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {cenarios.map((c, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Cenário {i + 1}</CardTitle>
              <CardDescription>Parâmetros independentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="space-y-1">
                <Label>Intensidade I(t)</Label>
                <Input
                  type="number"
                  value={c.I}
                  onChange={(e) => atualizarCampo(i, "I", Number(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <Label>Drenagem D(t)</Label>
                <Input
                  type="number"
                  value={c.D}
                  onChange={(e) => atualizarCampo(i, "D", Number(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <Label>Duração (horas)</Label>
                <Input
                  type="number"
                  min={1}
                  value={c.horas}
                  onChange={(e) => atualizarCampo(i, "horas", Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button size="lg" className="w-full" onClick={rodarTodos}>
        Rodar Todos os Cenários
      </Button>

      <Separator />

      {/* Resultados lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {cenarios.map((c, i) => {
          if (!c.dados) return null
          const ultimo = c.dados[c.dados.length - 1]

          return (
            <Card key={i}>
              <CardHeader>
                <CardTitle>Resultados — Cenário {i + 1}</CardTitle>
                <CardDescription>Resumo hidrológico</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p><strong>Nível final A(t):</strong> {ultimo.A.toFixed(1)} mm</p>
                <p><strong>Derivada final A′(t):</strong> {ultimo.dA.toFixed(1)} mm/h</p>
                <p><strong>Risco final:</strong> {ultimo.risco.toFixed(0)}%</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Separator />

      {/* Gráficos comparativos */}
      <section>
        <h2 className="text-xl font-semibold">Comparação Visual</h2>
        <p className="text-muted-foreground mb-4">
          Abaixo você pode comparar o comportamento hidrológico dos três cenários simultaneamente.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Intensidade × Drenagem</CardTitle>
          </CardHeader>
          <CardContent>
            {cenarios.map((c, i) => (
              c.dados && (
                <div key={i} className="mb-10">
                  <p className="font-semibold mb-2">Cenário {i + 1}</p>
                  <ChartIntensidadeDrenagem data={c.dados} />
                </div>
              )
            ))}
          </CardContent>
        </Card>

        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Acúmulo A(t)</CardTitle>
          </CardHeader>
          <CardContent>
            {cenarios.map((c, i) => (
              c.dados && (
                <div key={i} className="mb-10">
                  <p className="font-semibold mb-2">Cenário {i + 1}</p>
                  <ChartAcumuloAgua data={c.dados} />
                </div>
              )
            ))}
          </CardContent>
        </Card>

        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Derivada A′(t)</CardTitle>
          </CardHeader>
          <CardContent>
            {cenarios.map((c, i) => (
              c.dados && (
                <div key={i} className="mb-10">
                  <p className="font-semibold mb-2">Cenário {i + 1}</p>
                  <ChartDerivada data={c.dados} />
                </div>
              )
            ))}
          </CardContent>
        </Card>

        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Risco ao longo do tempo</CardTitle>
          </CardHeader>
          <CardContent>
            {cenarios.map((c, i) => (
              c.dados && (
                <div key={i} className="mb-10">
                  <p className="font-semibold mb-2">Cenário {i + 1}</p>
                  <ChartRisco data={c.dados} />
                </div>
              )
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
