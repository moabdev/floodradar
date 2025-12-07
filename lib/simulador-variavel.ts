// ================================================
//  FloodRadar – Simulador com chuva variável (Δt = 1h)
// ================================================

export type SimPointVariavel = {
  t: number
  I: number
  D_efetiva: number
  A: number
  dA: number
  risco: number
  A_max: number
}

export type SimulacaoVariavelInput = {
  chuva: number[]
  D_max: number
  A_max: number
  A0: number
}

/**
 * Simulação hidrológica discreta.
 *
 * • A(0) = A0
 * • A(t) = A(t-1) + max(0, I(t-1) − D_efetiva)
 * • D_efetiva = min(D_max, A(t-1))
 * • risco(t) = 100 * A(t) / A_max
 */
export function rodarSimulacaoAvancadaVariavel(
  params: SimulacaoVariavelInput
): SimPointVariavel[] {
  const { chuva, D_max, A_max, A0 } = params

  if (!Array.isArray(chuva) || chuva.some(isNaN)) {
    throw new Error("Vetor de chuva inválido: contém valores não numéricos.")
  }

  if (A_max <= 0) throw new Error("A_max deve ser maior que zero.")
  if (D_max < 0) throw new Error("D_max não pode ser negativo.")

  const resultado: SimPointVariavel[] = []

  // t = 0 (estado inicial)
  resultado.push({
    t: 0,
    I: 0,
    D_efetiva: 0,
    A: A0,
    dA: 0,
    risco: Math.min(100, Math.max(0, (A0 / A_max) * 100)),
    A_max,
  })

  let A_anterior = A0

  for (let t = 1; t <= chuva.length; t++) {
    const I_t = chuva[t - 1]

    const D_efetiva = Math.min(D_max, Math.max(0, A_anterior))

    const excedente = Math.max(0, I_t - D_efetiva)
    const A_atual = A_anterior + excedente

    const dA = A_atual - A_anterior
    const risco = Math.min(100, Math.max(0, (A_atual / A_max) * 100))

    resultado.push({
      t,
      I: I_t,
      D_efetiva,
      A: A_atual,
      dA,
      risco,
      A_max,
    })

    A_anterior = A_atual
  }

  return resultado
}
