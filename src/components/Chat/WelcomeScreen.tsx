import { Brain, MessagesSquare, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: MessagesSquare,
    title: "Easy Conversations",
    description: "Engage in fluid, context-aware dialogue",
  },
  {
    icon: Sparkles,
    title: "Smart Suggestions",
    description: "Get intelligent follow-up suggestions",
  },
  {
    icon: Zap,
    title: "Quick Responses",
    description: "Receive fast and accurate answers",
  },
];

export function WelcomeScreen() {
  return (
    <div className="h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[90%] w-[640px] mx-auto text-center space-y-6 sm:space-y-8"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="p-4 sm:p-6 rounded-full bg-primary/5 w-fit mx-auto"
        >
          <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </motion.div>

        <div className="space-y-2 sm:space-y-3">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
          >
            Welcome to AI Chat Assistant
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-lg text-muted-foreground max-w-[80%] mx-auto"
          >
            Your intelligent companion for insightful conversations
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 auto-rows-fr"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="group p-4 sm:p-6 rounded-xl bg-muted/50 hover:bg-muted/80 
                transition-colors duration-200 flex flex-col items-center text-center
                border border-transparent hover:border-border"
            >
              <feature.icon
                className="w-5 h-5 sm:w-6 sm:h-6 text-primary mb-2 sm:mb-3 
                transform group-hover:scale-110 transition-transform duration-200"
              />
              <h3 className="font-semibold text-sm sm:text-base mb-1">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
