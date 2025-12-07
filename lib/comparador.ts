// // lib/comparador.ts

// import { SimPointVariavel } from "./simulador-variavel"

// export type ResumoCenario = {
//   riscoFinal: number
//   riscoMax: number
//   acumulacaoFinal: number
//   alerta: boolean
// }

// export function analisarCenario(data: SimPointVariavel[]): ResumoCenario {
//   const riscoFinal = data[data.length - 1].risco
//   const riscoMax = Math.max(...data.map(p => p.risco))
//   const acumulacaoFinal = data[data.length - 1].A

//   return {
//     riscoFinal,
//     riscoMax,
//     acumulacaoFinal,
//     alerta: riscoMax >= 80 // risco extremo
//   }
// }

// // Nova estrutura: usa exatamente os campos retornados por analisarCenario()
// export function compararCenarios(analises: ResumoCenario[]) {

//   // Informações completas por cenário
//   const cenarios = analises.map((a) => ({
//     riscoMax: a.riscoMax,
//     riscoFinal: a.riscoFinal,
//     acumulacaoFinal: a.acumulacaoFinal,
//     alerta: a.alerta
//   }))

//   // Ranking baseado no risco máximo
//   const ranking = cenarios
//     .map((c, i) => ({ i, risco: c.riscoMax }))
//     .sort((a, b) => b.risco - a.risco)
//     .map((r) => r.i)

//   const maisPerigoso = cenarios[ranking[0]]

//   const diferencas = {
//     entre1e2: cenarios[ranking[0]].riscoMax - cenarios[ranking[1]].riscoMax
//   }

//   return {
//     ranking,
//     cenarios,
//     maisPerigoso,
//     diferencas
//   }
// }

// lib/comparador.ts

import { SimPointVariavel } from "./simulador-variavel"

export type ResumoCenario = {
  riscoFinal: number
  riscoMax: number
  acumuloFinal: number
  acumuloMax: number
  drenagemMax: number
}

export function analisarCenario(data: SimPointVariavel[]): ResumoCenario {
  if (!data.length) {
    return {
      riscoFinal: 0,
      riscoMax: 0,
      acumuloFinal: 0,
      acumuloMax: 0,
      drenagemMax: 0,
    }
  }

  const riscoFinal = data[data.length - 1].risco
  const riscoMax = Math.max(...data.map(p => p.risco))
  const acumuloFinal = data[data.length - 1].A
  const acumuloMax = Math.max(...data.map(p => p.A))
  const drenagemMax = Math.max(...data.map(p => p.D))

  return {
    riscoFinal,
    riscoMax,
    acumuloFinal,
    acumuloMax,
    drenagemMax,
  }
}

export function compararCenarios(analises: ResumoCenario[]) {
  const cenarios = analises

  // Ranking por risco máximo (maior = pior)
  const ranking = cenarios
    .map((c, i) => ({ i, risco: c.riscoMax }))
    .sort((a, b) => b.risco - a.risco)
    .map(r => r.i)

  const maisPerigoso = cenarios[ranking[0]]

  const diferencas = {
    entre1e2:
      ranking.length > 1
        ? cenarios[ranking[0]].riscoMax - cenarios[ranking[1]].riscoMax
        : 0,
  }

  return {
    ranking,
    maisPerigoso,
    diferencas,
    cenarios,
  }
}
