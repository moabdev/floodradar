export type SimPoint = {
  t: number         // tempo (horas)
  A: number         // nível acumulado
  I: number         // intensidade da chuva
  D: number         // drenagem
  dA: number        // derivada / taxa de variação
  risco: number     // risco percentual
}

/**
 * Modelo simples:
 *  A(t + 1) = A(t) + (I - D)
 *  dA = I - D
 *  risco = clamp( A * 2.4 , 0 , 100 )
 */
export function rodarSimulacao(I: number, D: number, horas: number): SimPoint[] {
  const result: SimPoint[] = []
  let A = 10

  for (let t = 0; t <= horas; t++) {
    const dA = I - D
    const risco = Math.min(100, Math.max(0, A * 2.4))

    result.push({ t, A, I, D, dA, risco })

    A += dA
  }

  return result
}
