"use client"

import "katex/dist/katex.min.css"
import TeX from "react-katex"

export function Latex({ value }: { value: string }) {
  return <TeX math={value} block className="my-4 text-lg" />
}
