"use client"

import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import {
  rodarSimulacaoAvancadaVariavel,
  SimPointVariavel
} from "@/lib/simulador-variavel"

import { analisarCenario, compararCenarios } from "@/lib/comparador"

import { ChartAcumuloAgua } from "@/components/charts/chart-acumulo"
import { ChartRisco } from "@/components/charts/chart-risco"
import { ChartIntensidadeDrenagem } from "@/components/charts/chart-intensidade-drenagem"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

import { SafeNumberInput } from "@/components/safe-number-input"

// Tipagem do resumo dos cenários
interface ResumoCenario {
  riscoFinal: number
  riscoMax: number
  acumuloFinal: number
  acumuloMax: number
  drenagemMax: number
  alerta: boolean
}

interface Comparacao {
  ranking: number[]
  maisPerigoso: ResumoCenario
  diferencas: { entre1e2: number }
  cenarios: ResumoCenario[]
}


// ==================================================================
//  PÁGINA PRINCIPAL
// ==================================================================

export default function CenariosPage() {
  const [horas, setHoras] = useState<number>(5)
  const [chuva, setChuva] = useState<string[][]>([
    ["12", "15", "20", "5", "0"],
    ["8", "10", "25", "30", "12"],
    ["20", "22", "18", "15", "10"]
  ])

  const [Dmax, setDmax] = useState<string[]>(["10", "8", "12"])
  const [Amax, setAmax] = useState<string>("120")
  const [A0, setA0] = useState<string>("10")

  const [dados, setDados] = useState<SimPointVariavel[][]>([])
  const [resumo, setResumo] = useState<Comparacao | null>(null)


  // Atualiza quantidade de horas
  function atualizarHoras(n: number) {
    if (!Number.isFinite(n) || n < 1) return

    setHoras(n)

    setChuva(prev =>
      prev.map(c => {
        const arr = [...c]
        while (arr.length < n) arr.push("0")
        while (arr.length > n) arr.pop()
        return arr
      })
    )
  }


  // Simulação
  function simular() {
    const AmaxNum = Number(Amax || 0)
    const A0Num = Number(A0 || 0)

    const series = chuva.map((c, i) =>
      rodarSimulacaoAvancadaVariavel({
        chuva: c.map(v => Number(v || 0)),
        D_max: Number(Dmax[i] || 0),
        A_max: AmaxNum,
        A0: A0Num
      })
    )

    toast("Simulação concluída ✔️", {
      description: "Os gráficos foram atualizados com os novos parâmetros.",
      duration: 3500
    })

    setDados(series)

    const analises = series.map(analisarCenario)
    const comp = compararCenarios(analises as ResumoCenario[])
    setResumo(comp)
  }



  return (
    <div className="space-y-16 pb-20">

      <h1 className="text-4xl font-bold tracking-tight">Cenários de Chuva Variável</h1>


      {/* ================================================================== */}
      {/* PAINEL DE PARÂMETROS                                             */}
      {/* ================================================================== */}

      <Card>
        <CardHeader>
          <CardTitle>Parâmetros dos Cenários</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* DURAÇÃO */}
            <div className="space-y-2">
              <Label>Duração (horas)</Label>
              <SafeNumberInput
                value={isNaN(horas) ? "" : horas.toString()}
                onChange={(v) => {
                  // Quando o usuário apaga tudo → deixa limpar
                  if (v === "") {
                    setHoras(NaN) // estado "temporário" durante edição
                    return
                  }

                  const num = Number(v)

                  // só atualiza quando houver número válido
                  if (Number.isFinite(num) && num >= 1) {
                    atualizarHoras(num)
                  }
                }}
                min={1}
              />


            </div>

            {/* Amax */}
            <div className="space-y-2">
              <Label>Amax</Label>
              <SafeNumberInput
                value={Amax}
                onChange={setAmax}
              />
            </div>

            {/* A0 */}
            <div className="space-y-2">
              <Label>A0</Label>
              <SafeNumberInput
                value={A0}
                onChange={setA0}
              />
            </div>

          </div>


          {/* ================================================================== */}
          {/* CENÁRIOS INDIVIDUAIS                                             */}
          {/* ================================================================== */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {chuva.map((cenario, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">

                <h2 className="font-semibold">Cenário {i + 1}</h2>

                <Label>Chuva I(t) hora a hora</Label>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {cenario.map((v, h) => (
                    <SafeNumberInput
                      key={h}
                      value={v}
                      onChange={(raw) => {
                        const arr = chuva.map(c => [...c])
                        arr[i][h] = raw
                        setChuva(arr)
                      }}
                    />
                  ))}
                </div>

                <Label>Dmax</Label>
                <SafeNumberInput
                  value={Dmax[i]}
                  onChange={(raw) => {
                    const arr = [...Dmax]
                    arr[i] = raw
                    setDmax(arr)
                  }}
                />
              </div>
            ))}
          </div>


          <Button
            onClick={simular}
            className={cn(
              "w-full py-4 text-lg font-semibold tracking-wide",
              "rounded-xl transition-all duration-300",
              "bg-linear-to-r from-blue-600 to-blue-500",
              "hover:from-blue-500 hover:to-blue-400 hover:shadow-lg",
              "text-white shadow-md active:scale-95"
            )}
          >
            Rodar Cenários
          </Button>

        </CardContent>
      </Card>




      {/* ================================================================== */}
      {/* RESUMO GERAL                                                      */}
      {/* ================================================================== */}

      {resumo && (
        <Card>
          <CardHeader>
            <CardTitle>Relatório de Comparação</CardTitle>
          </CardHeader>

          <CardContent className="text-lg space-y-4">

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




      {/* ================================================================== */}
      {/* ABAS COM GRÁFICOS                                                 */}
      {/* ================================================================== */}

      {dados.length > 0 && (
        <Tabs defaultValue="0" className="w-full">

          <TabsList className="w-full flex justify-center gap-4 flex-wrap">
            {dados.map((_, i) => (
              <TabsTrigger key={i} value={String(i)}>
                Cenário {i + 1}
              </TabsTrigger>
            ))}
          </TabsList>

          {dados.map((serie, i) => (
            <TabsContent key={i} value={String(i)}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Cenário {i + 1}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">

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
