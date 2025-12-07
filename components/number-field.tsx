// components/ui/number-field.tsx
"use client"

import { Input } from "@/components/ui/input"
import { useState } from "react"

type NumberFieldProps = {
  value: number
  min?: number
  max?: number
  onChange: (n: number) => void
  className?: string
}

export function NumberField({ value, onChange, min, max, className }: NumberFieldProps) {
  const [raw, setRaw] = useState(String(value))

  function sanitize(val: string) {
    // transforma vírgula em ponto
    val = val.replace(",", ".")

    // aceita apenas números + .
    val = val.replace(/[^0-9.]/g, "")

    // impede dois pontos
    const parts = val.split(".")
    if (parts.length > 2) val = parts[0] + "." + parts.slice(1).join("")

    return val
  }

  function commit(val: string) {
    if (val.trim() === "") {
      setRaw("0")
      onChange(0)
      return
    }

    const n = Number(val)

    if (!Number.isFinite(n)) return

    let final = n
    if (min !== undefined) final = Math.max(min, final)
    if (max !== undefined) final = Math.min(max, final)

    onChange(final)
    setRaw(String(final))
  }

  return (
    <Input
      className={className}
      value={raw}
      inputMode="decimal"
      onChange={(e) => setRaw(sanitize(e.target.value))}
      onBlur={() => commit(raw)}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit(raw)
      }}
    />
  )
}
