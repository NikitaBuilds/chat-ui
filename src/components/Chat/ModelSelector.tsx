import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { ModelType } from "@/lib/langchain/models";

interface Props {
  currentModel: ModelType;
  onModelChange: (model: ModelType) => void;
}

export function ModelSelector({ currentModel, onModelChange }: Props) {
  const models = [
    { id: "gpt-4" as const, name: "GPT-4 Turbo" },
    { id: "claude" as const, name: "Claude 3" },
    { id: "groq" as const, name: "Groq" },
  ];

  const getModelName = (modelId: ModelType) => {
    return models.find((m) => m.id === modelId)?.name || modelId;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-[140px] justify-between"
        >
          {getModelName(currentModel)}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => onModelChange(model.id)}
          >
            <Check
              className={`mr-2 h-4 w-4 ${
                currentModel === model.id ? "opacity-100" : "opacity-0"
              }`}
            />
            {model.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
