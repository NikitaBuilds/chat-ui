"use client";

import { Home, Library, Search, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Logo } from "../ui/logo";

const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
  },
  //   {
  //     label: "Discover",
  //     icon: Search,
  //     href: "/discover",
  //   },
  //   {
  //     label: "Spaces",
  //     icon: Users,
  //     href: "/spaces",
  //   },
  //   {
  //     label: "Library",
  //     icon: Library,
  //     href: "/library",
  //   },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[250px] flex-col border-r bg-background">
      <div className="p-3">
        <div className="mb-2 px-4 py-2">
          <Logo />
        </div>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === route.href ? "bg-accent" : "transparent"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
