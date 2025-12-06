import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          FloodRadar <span className="text-primary">Acadêmico</span>
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Simule cenários de enchentes, visualize o acúmulo de água A(t),
          a derivada A′(t) e o risco hidrológico, conectando diretamente
          os conceitos de Cálculo I com um problema real.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/simulacao">Começar pela Simulação</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/modelo-matematico">Ver Modelo Matemático</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3 text-sm">
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-medium mb-1">Funções e Derivadas</h2>
          <p className="text-muted-foreground">
            A(t), I(t), D(t) e A′(t) são usadas para modelar o acúmulo de água
            e a taxa de variação do nível.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-medium mb-1">Limites e Cenários Extremos</h2>
          <p className="text-muted-foreground">
            Entenda o que acontece quando a chuva tende ao infinito ou quando
            a drenagem satura.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-medium mb-1">Visualização Gráfica</h2>
          <p className="text-muted-foreground">
            Gráficos interativos mostram A(t), A′(t) e risco em tempo contínuo,
            com interpretação textual.
          </p>
        </div>
      </section>
    </div>
  )
}
