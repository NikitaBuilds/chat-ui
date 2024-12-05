import { Button } from "@/components/ui/button";
import { Menu, PlusCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Sidebar } from "../layout/Sidebar";
import { ModelSelector } from "./ModelSelector";

interface Props {
  onNewChat: () => void;
  currentModel: "gpt-4" | "claude" | "groq";
  onModelChange: (model: "gpt-4" | "claude" | "groq") => void;
}

export function ChatHeader({ onNewChat, currentModel, onModelChange }: Props) {
  return (
    <div className="border-b border-border p-4 flex items-center gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="p-0 w-[300px] sm:w-[400px] flex flex-col"
        >
          <SheetHeader className="px-6 py-4 border-b border-border">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <Sidebar />
          </div>
        </SheetContent>
      </Sheet>

      <ModelSelector
        currentModel={currentModel}
        onModelChange={onModelChange}
      />

      <div className="flex-1 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewChat}
          className="text-muted-foreground hover:text-foreground"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>
    </div>
  );
}
