"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export function DesktopNav() {
  const pathname = usePathname()

  const links = [
    { href: "/simulacao", label: "Simulação" },
    { href: "/cenarios", label: "Cenários" },
    { href: "/modelo-matematico", label: "Modelo Matemático" },
    { href: "/explicacoes", label: "Explicações" },
  ]


  return (
    <div className="flex items-center gap-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm transition-colors hover:text-primary",
            pathname === link.href
              ? "text-primary font-medium"
              : "text-muted-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}

      <ThemeToggle />
    </div>
  )
}
