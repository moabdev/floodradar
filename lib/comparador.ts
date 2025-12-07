import { SimPointVariavel } from "./simulador-variavel"

export type ResumoCenario = {
  riscoFinal: number
  riscoMax: number
  acumuloFinal: number
  acumuloMax: number
  drenagemMax: number
  alerta: boolean
}

/**
 * Analisa um único cenário da simulação
 */
export function analisarCenario(data: SimPointVariavel[]): ResumoCenario {
  if (data.length === 0) {
    throw new Error("Cenário vazio recebido em analisarCenario()")
  }

  const riscoFinal = data.at(-1)!.risco
  const riscoMax = Math.max(...data.map(p => p.risco))
  const acumuloFinal = data.at(-1)!.A
  const acumuloMax = Math.max(...data.map(p => p.A))
  const drenagemMax = Math.max(...data.map(p => p.D_efetiva))

  return {
    riscoFinal,
    riscoMax,
    acumuloFinal,
    acumuloMax,
    drenagemMax,
    alerta: riscoMax >= 80,
  }
}

/**
 * Compara vários cenários analisados
 */
// export function compararCenarios(analises: ResumoCenario[]) {
//   if (analises.length < 2) {
//     throw new Error("É necessário ao menos dois cenários para comparar.")
//   }

//   const cenarios = analises.map(a => ({
//     riscoMax: a.riscoMax,
//     acumuloMax: a.acumuloMax,
//     drenagemMax: a.drenagemMax,
//   }))

//   const ranking = cenarios
//     .map((c, i) => ({ i, risco: c.riscoMax }))
//     .sort((a, b) => b.risco - a.risco)
//     .map(r => r.i)

//   const maisPerigoso = cenarios[ranking[0]]

//   const diferencas = {
//     entre1e2:
//       cenarios[ranking[0]].riscoMax - cenarios[ranking[1]].riscoMax,
//   }

//   return {
//     ranking,
//     maisPerigoso,
//     diferencas,
//     cenarios,
//   }
// }


/**
 * Recebe um array de ResumoCenario completo e retorna:
 * - ranking
 * - maisPerigoso (ResumoCenario completo)
 * - diferenças
 * - cenários (ResumoCenario[])
 */
export function compararCenarios(analises: ResumoCenario[]) {
  // ranking baseado no risco máximo
  const ranking = analises
    .map((c, i) => ({ i, risco: c.riscoMax }))
    .sort((a, b) => b.risco - a.risco)
    .map(r => r.i)

  const maisPerigoso = analises[ranking[0]]

  const diferencas = {
    entre1e2:
      analises[ranking[0]].riscoMax -
      analises[ranking[1]].riscoMax
  }

  return {
    ranking,
    maisPerigoso,
    diferencas,
    cenarios: analises
  }
}
