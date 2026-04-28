import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { CommandPalette } from "./CommandPalette";

export function AppShell() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader onOpenPalette={() => setPaletteOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] px-6 py-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
