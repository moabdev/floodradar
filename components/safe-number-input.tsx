"use client"

import { Input } from "@/components/ui/input"
import { ChangeEvent } from "react"

type Props = {
  value: string
  onChange: (value: string) => void
  min?: number
}

export function SafeNumberInput({ value, onChange, min }: Props) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value

    // permite apagar
    if (raw === "") {
      onChange("")
      return
    }

    // permite apenas números
    const clean = raw.replace(/[^0-9.,]/g, "")

    onChange(clean)
  }

  return (
    <Input
      value={value}
      min={min}
      onChange={handleChange}
      inputMode="decimal"
    />
  )
}
