"use client"

import { Latex } from "@/components/latex/Latex"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function ModeloMatematicoPage() {
  return (
    <div className="space-y-10">

      {/* CABEÇALHO */}
      <section className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Modelo Matemático do FloodRadar</h1>
        <p className="text-muted-foreground max-w-2xl">
          O FloodRadar é uma aplicação web que usa conceitos de Cálculo I — funções, derivadas, limites e integrais —
          para modelar o nível de água em uma região urbana durante eventos de chuva intensa e estimar o risco de enchente.
        </p>
      </section>

      {/* DEFINIÇÕES */}
      <Card>
        <CardHeader>
          <CardTitle>Variáveis, Funções e Contexto Físico</CardTitle>
        </CardHeader>

        <CardContent className="prose dark:prose-invert max-w-none">
          <p>O modelo se baseia nas seguintes grandezas:</p>

          <ul>
            <li><strong>I(t)</strong>: intensidade da chuva na hora <em>t</em> (mm/h);</li>
            <li><strong>D(t)</strong>: taxa de drenagem efetiva na hora <em>t</em> (mm/h);</li>
            <li><strong>D<sub>max</sub></strong>: capacidade máxima de drenagem do sistema (mm/h);</li>
            <li><strong>A(t)</strong>: nível acumulado de água na região (mm);</li>
            <li><strong>A<sub>0</sub></strong>: nível inicial de água antes da chuva (mm);</li>
            <li><strong>A<sub>max</sub></strong>: limite crítico de acúmulo a partir do qual consideramos enchente (mm).</li>
          </ul>

          <p>
            Em termos físicos, <strong>I(t)</strong> representa a “entrada” de água no sistema (chuva),
            enquanto <strong>D(t)</strong> representa a “saída” (drenagem, escoamento, infiltração etc.).
            O acúmulo <strong>A(t)</strong> é o resultado líquido desse balanço ao longo do tempo.
          </p>
        </CardContent>
      </Card>

      {/* MODELO CONTÍNUO (INTEGRAL) */}
      <Card>
        <CardHeader>
          <CardTitle>Modelo Contínuo: Funções e Integral do Acúmulo</CardTitle>
        </CardHeader>

        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            Em um modelo contínuo idealizado, o nível de água pode ser descrito pela integral do balanço
            entre chuva e drenagem:
          </p>

          <LatexBlock>
{`
A(t) = A_0 + \\int_0^t \\big(I(u) - D(u)\\big)\\,du
`}
          </LatexBlock>

          <p>
            Essa expressão mostra que o acúmulo em <em>t</em> é igual ao nível inicial <strong>A₀</strong>
            somado à área sob a curva da função <strong>I(u) − D(u)</strong> no intervalo de tempo de 0 até t.
            Se, em média, <strong>I(u) &gt; D(u)</strong>, o termo dentro da integral é positivo e o nível cresce;
            se <strong>I(u) &lt; D(u)</strong>, o nível tende a baixar.
          </p>
        </CardContent>
      </Card>

      {/* MODELO DISCRETO (USADO NO CÓDIGO) */}
      <Card>
        <CardHeader>
          <CardTitle>Modelo Discreto: Aproximação por Somatórios</CardTitle>
        </CardHeader>

        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            Na aplicação, usamos passos de tempo discretos de tamanho <strong>Δt</strong> (por exemplo, 1 hora).
            A integral é aproximada por somatórios. A fórmula básica de atualização é:
          </p>

          <LatexBlock>
{`
A(t + \\Delta t) \\approx A(t) + \\big(I(t) - D(t)\\big)\\,\\Delta t
`}
          </LatexBlock>

          <p>
            Em muitos cenários didáticos do FloodRadar, consideramos <strong>Δt = 1</strong> hora, 
            o que simplifica para:
          </p>

          <LatexBlock>
{`
A(t+1) = A(t) + I(t) - D(t)
`}
          </LatexBlock>

          <p>
            Quando a drenagem é limitada por uma capacidade máxima, modelamos:
          </p>

          <LatexBlock>
{`
D(t) = \\min\\big(D_{max},\\, A(t) + I(t)\\big)
`}
          </LatexBlock>

          <p>
            Isso significa que o sistema nunca drena mais do que sua capacidade física
            nem mais água do que realmente existe naquele instante.
          </p>
        </CardContent>
      </Card>

      {/* DERIVADA */}
      <Card>
        <CardHeader>
          <CardTitle>Derivada: Taxa Instantânea de Variação A′(t)</CardTitle>
        </CardHeader>

        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            No modelo contínuo, a derivada da função de acúmulo é:
          </p>

          <LatexBlock>
{`
A'(t) = I(t) - D(t)
`}
          </LatexBlock>

          <p>
            Ela indica, em cada instante, se o nível está:
          </p>

          <ul>
            <li><strong>A′(t) &gt; 0</strong>: o nível está aumentando (entrada maior que a saída);</li>
            <li><strong>A′(t) = 0</strong>: o sistema está em equilíbrio momentâneo;</li>
            <li><strong>A′(t) &lt; 0</strong>: o nível está diminuindo (drenagem maior que a entrada).</li>
          </ul>

          <p>
            Na prática computacional do FloodRadar, usamos uma derivada aproximada (diferença finita):
          </p>

          <LatexBlock>
{`
A'(t) \\approx \\frac{A(t) - A(t-1)}{\\Delta t}
`}
          </LatexBlock>

          <p>
            Para <strong>Δt = 1</strong> hora, isso se reduz a:
          </p>

          <LatexBlock>
{`
A'(t) \\approx A(t) - A(t-1)
`}
          </LatexBlock>

          <p>
            Essa taxa é justamente o que alimenta o gráfico de <strong>A′(t)</strong> na aplicação
            e os alertas por cor:
          </p>

          <ul>
            <li><strong>verde</strong> → A′(t) ≤ 0 (situação estável ou melhorando);</li>
            <li><strong>amarelo</strong> → 0 &lt; A′(t) ≤ k (aumento moderado);</li>
            <li><strong>vermelho</strong> → A′(t) &gt; k (subida acelerada);</li>
            <li><strong>alerta máximo</strong> → A(t) ≥ A<sub>max</sub> (enchente confirmada).</li>
          </ul>
        </CardContent>
      </Card>

      {/* LIMITES E COMPORTAMENTOS EXTREMOS */}
      <Card>
        <CardHeader>
          <CardTitle>Limites e Comportamentos Extremos</CardTitle>
        </CardHeader>

        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            O conceito de limite ajuda a entender cenários extremos e prever tendências a longo prazo.
            Alguns casos importantes:
          </p>

          <ol className="space-y-2">
            <li>
              <strong>Ausência de chuva:</strong>
              <br />
              Se <Latex inline value={"I(t) = 0"} /> para todo t, então:
              <LatexBlock>
{`
A'(t) = -D(t)
`}
              </LatexBlock>
              O nível de água sempre diminui, pois só há saída.
            </li>

            <li>
              <strong>Chuva excessiva e prolongada:</strong>
              <br />
              Se <Latex inline value={"I(t) \\gg D(t)"} /> por muito tempo, então{" "}
              <Latex inline value={"A'(t) \\approx I(t)"} /> é grande e positiva, e:
              <LatexBlock>
{`
\\lim_{t \\to +\\infty} A(t) = +\\infty \\quad 
`}
              </LatexBlock>
              Na prática, isso representa uma enchente inevitável se não houver aumento de drenagem.
            </li>

            <li>
              <strong>Drenagem saturada:</strong>
              <br />
              Em muitos sistemas existe um limite físico:
              <LatexBlock>
{`
\\lim_{t \\to +\\infty} D(t) = D_{max}
`}
              </LatexBlock>
              Esse limite mostra que, mesmo que a chuva aumente, a drenagem não consegue crescer indefinidamente.
            </li>

            <li>
              <strong>Pontos críticos:</strong>
              <br />
              Os instantes em que:
              <LatexBlock>
{`
A'(t) = 0
`}
              </LatexBlock>
              indicam momentos de equilíbrio entre entrada e saída. O FloodRadar destaca esses pontos
              no gráfico como mudanças importantes de regime (de subida para estabilidade ou queda).
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* INTEGRAL COMO ACÚMULO REAL */}
      <Card>
        <CardHeader>
          <CardTitle>Integral e Cálculo do Acúmulo Real</CardTitle>
        </CardHeader>

        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            Apesar de o código utilizar somatórios discretos, a lógica matemática vem diretamente
            do conceito de integral:
          </p>

          <LatexBlock>
{`
A(t) = A_0 + \\int_0^t \\big(I(u) - D(u)\\big)\\,du
`}
          </LatexBlock>

          <p>
            A integral determina:
          </p>

          <ul>
            <li>o nível exato de água em qualquer instante t;</li>
            <li>o momento em que o limite crítico A<sub>max</sub> é ultrapassado;</li>
            <li>a rapidez com que ocorre o acúmulo total.</li>
          </ul>

          <p>
            Sem o conceito de integral, seria impossível justificar matematicamente os gráficos de acúmulo
            e a previsão precisa do momento em que a enchente ocorre — teríamos apenas uma noção qualitativa.
          </p>
        </CardContent>
      </Card>

      {/* REFERÊNCIAS */}
      <Card>
        <CardHeader>
          <CardTitle>Referências</CardTitle>
        </CardHeader>

        <CardContent className="prose dark:prose-invert max-w-none text-sm">
          <ul>
            <li>Notas de aula da disciplina Cálculo I.</li>
            <li>Agência Nacional de Águas e Saneamento Básico (ANA).</li>
            <li>Documentação de React, Node.js e Recharts.</li>
            <li>Artigos introdutórios sobre modelagem hidrológica urbana.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

/* COMPONENTE PARA BLOCO LATEX */
function LatexBlock({ children }: { children: string }) {
  return (
    <div className="my-4">
      <Latex value={children} />
    </div>
  )
}
