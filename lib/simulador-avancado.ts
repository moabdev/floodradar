// lib/simulador-avancado.ts

// Cada ponto da simulação
export type SimPoint = {
  time: string      // string formatada, ex: "1.00h"
  t: number         // tempo em horas (numérico)
  A: number         // nível acumulado (mm)
  I: number         // intensidade da chuva (mm/h)
  D: number         // drenagem efetiva (mm/h)
  dA: number        // derivada A'(t) = I - D (mm/h)
  risco: number     // risco normalizado (0–100)
}

// Parâmetros do modelo hidrológico avançado
export type SimParams = {
  I: number          // intensidade de chuva constante (mm/h)
  horas: number      // duração total da simulação (horas)
  dt?: number        // passo de tempo (horas). Ex: 0.25 = 15min
  Dmax: number       // capacidade máxima de drenagem (mm/h)
  kD: number         // reatividade da drenagem (1/h)
  A0?: number        // nível inicial (mm)
}

/**
 * Modelo hidrológico:
 *
 *   A'(t) = I - D(A)
 *
 * com D(A) = min(Dmax, kD * A)
 *
 * Integração numérica via método de Euler explícito.
 */
export function rodarSimulacaoAvancada({
  I,
  horas,
  dt = 0.25,
  Dmax,
  kD,
  A0 = 10,
}: SimParams): SimPoint[] {
  const pontos: SimPoint[] = []

  let A = A0
  const nPassos = Math.max(1, Math.round(horas / dt))

  for (let n = 0; n <= nPassos; n++) {
    const t = n * dt

    // drenagem linear saturada
    const Dlin = A0 + kD * A
    const D = Math.min(Dmax, Dlin)

    const dA = I - D

    // risco simples proporcional ao nível (limitado a 0–100)
    const riscoBruto = 2.2 * A
    const risco = Math.min(100, Math.max(0, riscoBruto))

    pontos.push({
      time: `${t.toFixed(2)}h`,
      t,
      A,
      I,
      D,
      dA,
      risco,
    })

    // passo de Euler: A(t+dt) = A(t) + A'(t) * dt
    A = A + dA * dt
  }

  return pontos
}
