import Link from "next/link";
import { Flame, Info, Phone } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 h-16 glass-nav">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <Link href="/" className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-full">
              <Flame className="w-7 h-7 text-orange-400" />
          </div>
          <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground font-headline">
              VentureLens AI
              </h1>
              <p className="text-xs text-muted-foreground">AI Analyst for Startup Evaluation</p>
          </div>
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/about">About</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/contact">Contact</Link>
        </Button>
      </nav>
    </header>
  );
}
