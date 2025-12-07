// lib/risk-ml.ts
import type { SimPointInfiltracao } from "./simulador-infiltracao"

export type RiskPrediction = {
  riscoPrevisto: number
  classe: "baixo" | "moderado" | "alto" | "extremo"
}

// pequena função de ativação
function relu(x: number) {
  return x > 0 ? x : 0
}

// aproxima logistic sem precisar de lib
function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x))
}

export function extrairFeatures(
  data: SimPointInfiltracao[],
  params: { Dmax: number; Amax: number }
) {
  const n = data.length
  const medias = data.reduce(
    (acc, p) => {
      acc.I += p.I
      acc.A += p.A
      acc.risco += p.risco
      return acc
    },
    { I: 0, A: 0, risco: 0 }
  )

  const I_med = medias.I / n
  const A_med = medias.A / n
  const riscoMax = Math.max(...data.map((p) => p.risco))
  const I_max = Math.max(...data.map((p) => p.I))

  return {
    I_med,
    I_max,
    A_med,
    riscoMax,
    duracao: n,
    Dmax: params.Dmax,
    Amax: params.Amax,
  }
}

export function preverRiscoNeural(
  data: SimPointInfiltracao[],
  params: { Dmax: number; Amax: number }
): RiskPrediction {
  const f = extrairFeatures(data, params)

  // vetor de entrada x
  const x = [
    f.I_med,
    f.I_max,
    f.A_med,
    f.riscoMax,
    f.duracao,
    f.Dmax,
    f.Amax,
  ]

  // rede neural simples: 7 -> 4 -> 1
  // pesos "inventados" (você pode recalibrar)
  const W1 = [
    [0.05, 0.08, 0.02, 0.09, 0.01, -0.03, -0.02], // neurônio 1
    [0.02, 0.04, 0.03, 0.07, 0.02, -0.01, -0.01], // neurônio 2
    [0.01, 0.03, 0.06, 0.08, 0.02, -0.02, -0.03], // neurônio 3
    [0.06, 0.07, 0.04, 0.10, 0.03, -0.04, -0.01], // neurônio 4
  ]
  const b1 = [0, 0, 0, 0]

  // camada oculta h = ReLU(W1 x + b1)
  const h = W1.map((wRow, i) => {
    const s = wRow.reduce((acc, wj, j) => acc + wj * x[j], b1[i])
    return relu(s)
  })

  // camada de saída: y = sigmoid(w2 · h + b2) * 100
  const w2 = [0.4, 0.6, 0.5, 0.7]
  const b2 = 0.1

  const z = h.reduce((acc, hj, j) => acc + w2[j] * hj, b2)
  const prob = sigmoid(z)
  const riscoPrevisto = Math.min(100, Math.max(0, prob * 120)) // escala um pouco

  let classe: RiskPrediction["classe"] = "baixo"
  if (riscoPrevisto >= 80) classe = "extremo"
  else if (riscoPrevisto >= 60) classe = "alto"
  else if (riscoPrevisto >= 30) classe = "moderado"

  return { riscoPrevisto, classe }
}
