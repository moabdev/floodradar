import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Latex } from "@/components/latex/Latex"

export default function ExplicacoesPage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">
          Explicações Intuitivas
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Aqui conectamos os símbolos matemáticos às ideias intuitivas de
          enchentes, acúmulo de água e risco. Ideal para explicar o projeto
          na apresentação.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Integral como acúmulo</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            A integral pode ser vista como uma <strong>soma contínua</strong>.
            No nosso caso, ela soma a diferença entre a chuva que entra e a
            água que sai pela drenagem.
          </p>

          <Latex value={`A(t) = A(0) + \\int_0^t \\big(I(s) - D(s)\\big)\\,ds`} />

          <p>
            Em vez de implementar a integral contínua, usamos uma aproximação
            por passos discretos de 1 hora, o que leva à fórmula usada no código:
          </p>

          <Latex value={`A(t+1) = A(t) + (I - D)`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Derivada como “velocímetro do risco”</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            A derivada A′(t) funciona como um <strong>velocímetro</strong> do
            nível de água: diz se o nível está subindo, descendo ou parado
            naquele instante.
          </p>

          <Latex value={`A'(t) = I(t) - D(t)`} />

          <p>
            Se A′(t) é positivo e grande, o risco ainda pode estar abaixo de um
            limiar, mas a <strong>tendência</strong> é de chegar em uma situação
            crítica rapidamente.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Do modelo matemático ao gráfico</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            Cada gráfico do FloodRadar é apenas uma representação visual de
            funções matemáticas simples:
          </p>

          <ul>
            <li>O gráfico de A(t) mostra como o acúmulo evolui no tempo.</li>
            <li>
              O gráfico de A′(t) mostra se estamos acelerando ou freando o risco.
            </li>
            <li>
              O gráfico de risco(t) traduz A(t) em uma escala percentual de 0 a 100.
            </li>
          </ul>

          <p>
            Isso deixa claro para a banca que há uma relação direta entre o
            <strong>código</strong>, os <strong>gráficos</strong> e o
            <strong>conteúdo de Cálculo I</strong>.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
