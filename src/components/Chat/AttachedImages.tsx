import { Button } from "@/components/ui/button";
import { Message, ChatImage } from "@/types/chat";
import { X } from "lucide-react";

interface Props {
  messages: Message[];
  onImageRemove?: (imageId: string) => void;
}

export default function AttachedImages({ messages, onImageRemove }: Props) {
  const lastMessage =
    messages.length > 0 ? messages[messages.length - 1] : null;
  const images = lastMessage?.images || [];

  if (images.length === 0) return null;

  return (
    <div className="p-4 border-b border-border">
      <span className="text-xs font-semibold mb-2 text-slate-600 dark:text-slate-400">
        Attached Images
      </span>
      <div className="flex gap-2 mt-2 overflow-x-auto pb-2 ">
        {images.map((image) => (
          <div key={image.id} className="relative group shrink-0">
            <img
              src={image.preview || image.url}
              alt="Attached"
              className="w-20 h-20 object-cover rounded-lg -z-10"
            />
            {onImageRemove && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onImageRemove(image.id)}
              >
                <X className="h-4 w-4 z-10" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
