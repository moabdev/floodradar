import type { Metadata } from "next"
import "./globals.css"
import Link from "next/link"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/Navigation"
import { ThemeToggle } from "@/components/theme-toggle"


export const metadata: Metadata = {
  title: "FloodRadar",
  description: "Simulação e visualização avançada de risco de enchentes",
}

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">

            {/* HEADER */}
            <header
              className="
                sticky top-0 z-40 w-full border-b 
                bg-background/70 backdrop-blur-md
                supports-[backdrop-filter]:bg-background/60
              "
            >
              <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="
                    flex h-9 w-9 items-center justify-center rounded-lg
                    bg-primary/10 text-primary font-bold group-hover:bg-primary/20
                    transition-colors
                  ">
                    FR
                  </div>

                  <div className="leading-tight">
                    <span className="font-semibold tracking-tight text-base">
                      FloodRadar
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Previsão hidrológica inteligente
                    </p>
                  </div>
                </Link>

                {/* NAV */}
                <Navigation />

              </div>
            </header>

            {/* MAIN */}
            <main className="flex-1">
              <div className="max-w-6xl mx-auto px-4 py-10">
                {children}
              </div>
            </main>

            {/* FOOTER */}
            <footer className="border-t bg-background/50 backdrop-blur">
              <div className="
                max-w-6xl mx-auto px-4 py-6 
                flex items-center justify-between 
                text-xs text-muted-foreground
              ">
                <span>FloodRadar · Análise Hidrológica Inteligente</span>
                <span className="opacity-50">v1.0</span>
              </div>
            </footer>

          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
