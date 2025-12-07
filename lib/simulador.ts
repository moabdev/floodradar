// lib/simulador.ts

export type SimulacaoInput = {
  I: number        // intensidade da chuva (mm/h)
  D_max: number    // drenagem máxima
  A_max: number    // capacidade máxima
  horas: number    // duração
  A0: number       // acúmulo inicial
}

export type SimPoint = {
  tempo: number
  I: number
  D_efetiva: number
  A: number
  dA: number
  risco: number
  A_max: number
}

/**
 * Executa a simulação hidrológica passo a passo.
 * O modelo segue:
 *
 *  D_efetiva(t) = min(D_max, A(t−1))    (não se drena mais água do que existe)
 *  A(t) = A(t−1) + I − D_efetiva
 *  dA(t) = A(t) − A(t−1)                (derivada discreta)
 *  risco(t) = 100 * A(t) / A_max
 *
 * Tudo com passo de 1 hora.
 */
export function rodarSimulacaoAvancada(params: SimulacaoInput): SimPoint[] {
  const { I, D_max, A_max, horas, A0 } = params

  const resultado: SimPoint[] = []

  let A_anterior = A0

  for (let t = 0; t <= horas; t++) {
    // drenagem efetiva não pode exceder nem A(t-1) nem D_max
    const D_efetiva = Math.min(D_max, A_anterior)

    // acúmulo no passo atual
    const A_atual = A_anterior + (t === 0 ? 0 : I - D_efetiva)

    // derivada discreta
    const dA = t === 0 ? 0 : A_atual - A_anterior

    // risco
    const risco = Math.max(0, Math.min(100, (A_atual / A_max) * 100))

    resultado.push({
      tempo: t,
      I,
      D_efetiva,
      A: A_atual,
      dA,
      risco,
      A_max
    })

    A_anterior = A_atual
  }

  return resultado
}
