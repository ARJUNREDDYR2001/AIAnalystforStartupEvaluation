import { Flame } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";

export function Header() {
  return (
    <header className="flex items-center gap-4 px-4 sm:px-6 h-16 glass-nav">
       <SidebarTrigger className="md:hidden" />
      <div className="flex items-center gap-2">
        <div className="p-2 bg-primary/10 rounded-full">
            <Flame className="w-7 h-7 text-orange-400" />
        </div>
        <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground font-headline">
            Fireside AI
            </h1>
            <p className="text-xs text-muted-foreground">AI Analyst for Startup Evaluation</p>
        </div>
      </div>
    </header>
  );
}
