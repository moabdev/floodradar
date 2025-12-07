"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function ExplicacoesPage() {
  return (
    <div className="space-y-12">
      <h1 className="text-4xl font-bold tracking-tight">Explicações Didáticas</h1>

      {/* DIAGRAMA 1 */}
      <Card>
        <CardHeader>
          <CardTitle>Como a chuva gera acúmulo de água</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DiagramChuva />
          <p className="text-muted-foreground text-sm leading-relaxed">
            A chuva <strong>I(t)</strong> entra no sistema, mas a drenagem possui um limite{" "}
            <strong>D<sub>max</sub></strong>. Sempre que a chuva ultrapassa esse limite,
            o excedente se transforma em acúmulo <strong>A(t)</strong>.  
            Isso explica por que eventos intensos ou prolongados podem causar aumento
            rápido do nível d’água.
          </p>
        </CardContent>
      </Card>

      {/* DIAGRAMA 2 */}
      <Card>
        <CardHeader>
          <CardTitle>Como o risco aumenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DiagramRisco />
          <p className="text-muted-foreground text-sm leading-relaxed">
            O risco é proporcional ao quanto o acúmulo <strong>A(t)</strong> se aproxima do
            limite físico da região <strong>A<sub>max</sub></strong>.  
            Quanto maior a proporção, mais próximo o sistema está de uma enchente grave.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function DiagramChuva() {
  return (
    <div className="p-4 border rounded-lg bg-muted/30 text-sm flex flex-col gap-3">

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-sky-400 rounded-full" />
        <span>Chuva I(t)</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-orange-500 rounded-full" />
        <span>Drenagem Dₘₐₓ</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-600 rounded-full" />
        <span>Acúmulo A(t)</span>
      </div>

      <p className="text-xs text-muted-foreground">
        O acúmulo cresce quando <strong>I(t) &gt; Dₘₐₓ</strong>.  
        Caso contrário, não há aumento de nível.
      </p>
    </div>
  )
}

function DiagramRisco() {
  return (
    <div className="p-4 border rounded-lg bg-muted/30 text-sm flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="w-full h-2 bg-blue-300 rounded" />
        <span>0%</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-full h-2 bg-yellow-300 rounded" />
        <span>50%</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-full h-2 bg-red-500 rounded" />
        <span>100%</span>
      </div>

      <p className="text-xs text-muted-foreground">
        À medida que <strong>A(t) → A<sub>max</sub></strong>, o risco cresce até 100%.
      </p>
    </div>
  )
}
