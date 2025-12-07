"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { links } from "@/data"

export function DesktopNav() {
  const pathname = usePathname()

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
