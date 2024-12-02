"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogIn, LogOut, MessageCircle, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  remainingMessages?: number;
}

export function UserMenu({ remainingMessages }: Props) {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <div className="h-[72px] border-t border-border">
        <Button
          variant="ghost"
          className="h-full w-full px-5 justify-between"
          onClick={() => signIn("google")}
        >
          <div className="flex items-center gap-2">
            <User className="w-8 h-8" />
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium">Guest User</span>
              <span className="text-xs text-muted-foreground">
                Sign in to continue
              </span>
            </div>
          </div>
          <LogIn className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>
    );
  }

  return (
    <div className="h-[72px] border-t border-border">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-full w-full px-5 justify-start">
            <div className="flex items-center gap-2">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-8 h-8"
                />
              ) : (
                <User className="w-8 h-8" />
              )}
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium">{session.user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {session.user.email}
                </span>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px]">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="text-red-600 dark:text-red-400"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
