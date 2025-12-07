"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { links } from "@/data"

export function MobileNav() {
  const pathname = usePathname()

  return (
    <Sheet>
      {/* Botão que abre o menu */}
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-md">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      {/* Painel lateral */}
      <SheetContent side="right" className="w-64">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Navegue pelo aplicativo.</SheetDescription>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 mt-6 px-2">

          {/* Links */}
          <div className="grid gap-2">
            {links.map(link => {
              const active = pathname === link.href
              return (
                <SheetClose asChild key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm transition-colors",
                      active
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              )
            })}
          </div>

          {/* Alternância de Tema */}
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-sm text-muted-foreground">Tema</span>
            <ThemeToggle />
          </div>
        </div>

        {/* Rodapé do menu */}
        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button variant="outline">Fechar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
