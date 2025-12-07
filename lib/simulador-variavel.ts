// // lib/simulador-variavel.ts

// export type SimPointVariavel = {
//   tempo: number
//   I: number          // chuva naquele passo
//   D_efetiva: number  // drenagem aplicada
//   A: number          // acúmulo
//   dA: number         // derivada discreta
//   risco: number      // risco percentual
//   A_max: number
// }

// export type SimulacaoVariavelInput = {
//   chuva: number[]        // vetor I(t)
//   D_max: number          // drenagem máxima permitida
//   A_max: number          // capacidade da região
//   A0: number             // acúmulo inicial
// }

// /**
//  * Simulação hidrológica com chuva variável hora a hora.
//  *
//  * Fórmulas:
//  *  D_efetiva(t) = min(D_max, A(t−1))
//  *  A(t) = A(t−1) + max(0, I(t) − D_efetiva(t))
//  *  dA(t) = A(t) − A(t−1)
//  *  risco(t) = 100 * A(t) / A_max
//  */
// export function rodarSimulacaoAvancadaVariavel(params: SimulacaoVariavelInput) {
//   const { chuva, D_max, A_max, A0 } = params

//   const resultado: SimPointVariavel[] = []

//   // PONTO INICIAL – SEM CHUVA
//   resultado.push({
//     tempo: 0,
//     I: 0,
//     D_efetiva: 0,
//     A: A0,
//     dA: 0,
//     risco: (A0 / A_max) * 100,
//     A_max,
//   })

//   let A_anterior = A0

//   // AGORA SIM: CHUVA COMEÇA A AGIR EM t = 1
//   for (let t = 1; t <= chuva.length; t++) {
//     const I_t = chuva[t - 1]

//     const D_efetiva = Math.min(D_max, A_anterior)
//     const A_atual = A_anterior + Math.max(0, I_t - D_efetiva)
//     const dA = A_atual - A_anterior
//     const risco = Math.max(0, Math.min(100, (A_atual / A_max) * 100))

//     resultado.push({
//       tempo: t,
//       I: I_t,
//       D_efetiva,
//       A: A_atual,
//       dA,
//       risco,
//       A_max,
//     })

//     A_anterior = A_atual
//   }

//   return resultado
// }

// lib/simulador-variavel.ts

// export type SimPointVariavel = {
//   t: number
//   I: number        // chuva naquele passo (associada à hora t)
//   D: number        // drenagem (constante = Dmax)
//   A: number        // acúmulo
//   dA: number       // derivada discreta
//   risco: number    // risco percentual
//   A_max: number
// }

export type SimulacaoVariavelInput = {
  chuva: number[]  // vetor I(0)...I(n-1)
  D_max: number
  A_max: number
  A0: number
}

/**
 * Modelo discreto com passo de 1h.
 *
 * Convenção de tempo:
 *  - t = 0: antes da chuva (A(0) = A0)
 *  - t = 1: após 1h de chuva I(0)
 *  - t = 2: após 2h de chuva I(1)
 *
 * Fórmulas:
 *  A(t) = A(t-1) + max(0, I(t-1) - Dmax)
 *  dA(t) = A(t) - A(t-1)
 *  risco(t) = 100 * A(t) / A_max (limitado em [0, 100])
 */
export type SimPointVariavel = {
  t: number
  I: number
  D_efetiva: number
  A: number
  dA: number
  risco: number
  A_max: number
}

export function rodarSimulacaoAvancadaVariavel(params: {
  chuva: number[]
  D_max: number
  A_max: number
  A0: number
}): SimPointVariavel[] {

  const { chuva, D_max, A_max, A0 } = params
  const resultado: SimPointVariavel[] = []

  // Ponto inicial
  resultado.push({
    t: 0,
    I: 0,
    D_efetiva: 0,
    A: A0,
    dA: 0,
    risco: (A0 / A_max) * 100,
    A_max,
  })

  let A_anterior = A0

  for (let t = 1; t <= chuva.length; t++) {
    const I_t = chuva[t - 1]

    const D_efetiva = Math.min(D_max, A_anterior)
    const A_atual = A_anterior + Math.max(0, I_t - D_efetiva)
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

