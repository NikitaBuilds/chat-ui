import { motion } from "framer-motion";
import { LogIn, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";

export function LimitReachedScreen() {
  return (
    <div className="h-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto text-center space-y-6"
      >
        <div className="p-6 rounded-full bg-primary/5 w-fit mx-auto">
          <MessageCircle className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Message Limit Reached</h2>
          <p className="text-muted-foreground">
            You&apos;ve used all your free messages. Sign in to continue
            chatting!
          </p>
        </div>
        <Button onClick={() => signIn("google")} className="w-full">
          <LogIn className="mr-2 h-4 w-4" />
          Sign in to Continue
        </Button>
      </motion.div>
    </div>
  );
}
