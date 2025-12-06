export type SimPoint = {
  t: number
  A: number
  I: number
  D: number
  dA: number
  risco: number
}

export function rodarSimulacao(I: number, D: number, horas: number): SimPoint[] {
  const result: SimPoint[] = []
  let A = 10

  for (let t = 0; t <= horas; t++) {
    const dA = I - D
    const risco = Math.min(100, A * 2.4)

    result.push({ t, A, I, D, dA, risco })

    A += dA
  }

  return result
}
