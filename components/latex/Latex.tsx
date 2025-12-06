"use client"

import "katex/dist/katex.min.css"
import { BlockMath, InlineMath } from "react-katex"

export function Latex({
  value,
  inline = false,
}: {
  value: string
  inline?: boolean
}) {
  return inline ? (
    <InlineMath math={value} />
  ) : (
    <BlockMath math={value} />
  )
}
