import { useSession } from "next-auth/react";

interface Props {
  remainingMessages: number | null;
}

export function RemainingMessages({ remainingMessages }: Props) {
  const { data: session } = useSession();

  if (session?.user || remainingMessages === null) return null;

  return (
    <div className="px-4 py-2 text-xs text-center text-muted-foreground border-t border-border ">
      {remainingMessages} free messages remaining
    </div>
  );
}
