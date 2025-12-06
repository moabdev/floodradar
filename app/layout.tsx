import type { Metadata } from "next"
import "./globals.css"
import Link from "next/link"

export const metadata: Metadata = {
  title: "FloodRadar",
  description: "Simulação e visualização de risco de enchentes com Cálculo I",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-background text-foreground min-h-screen antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="border-b bg-background/80 backdrop-blur">
            <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                  FR
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold tracking-tight">
                    FloodRadar
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Cálculo I aplicado a enchentes
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-4 text-sm">
                <Link href="/dashboard" className="hover:text-primary transition">
                  Dashboard
                </Link>
                <Link href="/simulacao" className="hover:text-primary transition">
                  Simulação
                </Link>
                <Link
                  href="/modelo-matematico"
                  className="hover:text-primary transition"
                >
                  Modelo Matemático
                </Link>
                <Link href="/explicacoes" className="hover:text-primary transition">
                  Explicações
                </Link>
              </div>
            </nav>
          </header>

          <main className="flex-1">
            <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
          </main>

          <footer className="border-t">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 text-xs text-muted-foreground">
              <span>FloodRadar · Projeto de Cálculo I</span>
              <span>Sem persistência · Simulação local</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}

