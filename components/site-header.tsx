import { ThemeToggle } from "./theme-toggle";


export function SiteHeader() {
  return (
    <header className="flex h-14 items-center px-6 border-b">
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  )
}
