"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  if (isAuthPage) {
    return children;
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full">
        <Sidebar className="w-[250px] border-r" />
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col h-full md:hidden">
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  );
}
