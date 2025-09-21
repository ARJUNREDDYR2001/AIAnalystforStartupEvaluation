import Link from "next/link";
import { Flame } from "lucide-react";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";

export function Header() {
  return (
    <header className="w-screen flex items-center justify-between gap-4 px-4 sm:px-6 h-16 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-orange-500/20 rounded-full">
              <Flame className="w-7 h-7 text-orange-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-white font-headline">
                VentureLens AI
              </h1>
              <p className="text-xs text-slate-300">AI Analyst for Startup Evaluation</p>
            </div>
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-1">
        <Button variant="ghost" className="text-slate-200 hover:bg-slate-700/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
          <Link href="/">Dashboard</Link>
        </Button>
        <Button variant="ghost" className="text-slate-300 hover:bg-slate-700/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
          <Link href="/about">About</Link>
        </Button>
        <Button variant="ghost" className="text-slate-300 hover:bg-slate-700/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
          <Link href="/contact">Contact</Link>
        </Button>
      </nav>
    </header>
  );
}
