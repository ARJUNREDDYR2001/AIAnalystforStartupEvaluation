import { Flame } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center gap-4 border-b px-4 sm:px-6 h-16">
      <div className="flex items-center gap-2">
        <Flame className="w-7 h-7 text-accent" />
        <h1 className="text-xl font-semibold tracking-tight text-foreground font-headline">
          Fireside AI
        </h1>
      </div>
    </header>
  );
}
