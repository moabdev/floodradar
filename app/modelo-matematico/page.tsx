import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Latex } from "@/components/latex/Latex"

export default function ModeloMatematicoPage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">
          Modelo Matemático
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Esta página descreve formalmente as funções, derivadas e limites
          utilizados na modelagem do risco de enchentes no FloodRadar.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Função de acúmulo A(t)</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            Modelamos o nível de água A(t) como resultado da diferença entre
            a intensidade de chuva I(t) e a capacidade de drenagem D(t).
          </p>

          <Latex value={`A(t + \\Delta t) = A(t) + (I - D)\\,\\Delta t`} />

          <p>
            No modelo discreto usado no código, consideramos passos de tempo
            inteiros, isto é, <strong>Δt = 1 hora</strong>, o que leva à
            expressão:
          </p>

          <Latex value={`A(t+1) = A(t) + (I - D)`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Derivada A′(t) como taxa de variação</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            A derivada A′(t) representa a taxa instantânea de variação do
            nível de água. No nosso modelo simplificado, com I e D constantes:
          </p>

          <Latex value={`A'(t) = I(t) - D(t)`} />

          <p>
            Interpretação:
          </p>
          <ul>
            <li><strong>A′(t) &gt; 0</strong> → o nível de água está subindo;</li>
            <li><strong>A′(t) = 0</strong> → regime em equilíbrio;</li>
            <li><strong>A′(t) &lt; 0</strong> → drenagem maior que a chuva, nível caindo.</li>
          </ul>

          <Latex value={`A'(t) > 0 \\Rightarrow \\text{tendência de aumento do risco}`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Indicador de risco</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            Para transformar o nível acumulado A(t) em um indicador simples de
            risco (0 a 100%), usamos uma função linear saturada:
          </p>

          <Latex value={`\\text{Risco}(t) = \\min\\big(100,\\,\\max(0,\\,k\\,A(t))\\big)`} />

          <p>
            No código, adotamos <strong>k = 2.4</strong>, apenas como fator
            de escala para fins didáticos:
          </p>

          <Latex value={`\\text{Risco}(t) = \\min(100,\\,2.4\\,A(t))`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Limites e cenários extremos</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            Os limites ajudam a interpretar cenários extremos de chuva e
            drenagem:
          </p>

          <Latex value={`\\lim_{I \\to 0} A'(t) = -D(t)`} />
          <p>
            Ausência de chuva implica tendência de queda do nível de água,
            dominada pela drenagem.
          </p>

          <Latex value={`\\lim_{I \\to +\\infty} A'(t) = +\\infty`} />
          <p>
            Chuva extremamente intensa leva a um crescimento descontrolado do
            nível — enchente inevitável.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
