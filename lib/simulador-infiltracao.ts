// lib/simulador-infiltracao.ts

export type SimPointInfiltracao = {
  t: number
  I: number      // chuva
  A: number      // acúmulo
  F: number      // infiltração
  Def: number    // drenagem efetiva
  risco: number  // 0–100
}

type Params = {
  intensidades: number[]  // I(t) em mm/h para cada hora
  Dmax: number           // capacidade máx. de drenagem
  Amax: number           // limite crítico de acúmulo
  Fmax: number           // infiltração máxima em solo "seco"
  k: number              // quanto a infiltração cai com a saturação (A)
  A0?: number            // acúmulo inicial (default = 0)
}

export function rodarSimulacaoInfiltracao({
  intensidades,
  Dmax,
  Amax,
  Fmax,
  k,
  A0 = 0,
}: Params): SimPointInfiltracao[] {
  let A = A0
  const out: SimPointInfiltracao[] = []

  for (let t = 0; t < intensidades.length; t++) {
    const I = intensidades[t]

    // 1) infiltração potencial cai quando A(t) aumenta
    const F_pot = Math.max(0, Fmax - k * A)

    // 2) infiltração efetiva não pode ser maior que a chuva
    const F = Math.min(I, F_pot)

    // 3) água disponível para drenagem
    const Wdisp = A + I - F

    // 4) drenagem efetiva limitada por Dmax e por água disponível
    const Def = Math.min(Dmax, Math.max(0, Wdisp))

    // 5) evolução do acúmulo
    A = A + I - F - Def
    A = Math.max(0, A) // não deixa negativo

    // 6) risco relativo ao limite máximo
    const risco = Math.min(100, (A / Amax) * 100)

    out.push({ t, I, A, F, Def, risco })
  }

  return out
}
