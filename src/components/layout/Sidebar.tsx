"use client";

import { Home, Library, Search, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Logo } from "../ui/logo";
import { UserMenu } from "./UserMenu";

interface SidebarProps {
  className?: string;
}

const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1">
        <div className="mb-2 p-4">
          <Logo />
        </div>
        <div className="space-y-1 px-3">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-2 rounded-lg px-4 py-2 text-base leading-7 font-ibm-plex dark:text-slate-100 transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === route.href ? "bg-accent" : "transparent"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </div>
      </div>
      <UserMenu />
    </div>
  );
}
