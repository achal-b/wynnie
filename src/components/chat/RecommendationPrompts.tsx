import { Sparkles, Sun, Moon, Coffee, Zap } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { RecommendationPrompt } from "@/lib/types";

interface RecommendationPromptsProps {
  prompts: RecommendationPrompt[];
  onPromptClick: (prompt: string) => void;
}

export const RecommendationPrompts = ({
  prompts,
  onPromptClick,
}: RecommendationPromptsProps) => {
  // Get current time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning", icon: Sun };
    if (hour < 17) return { text: "Good afternoon", icon: Coffee };
    return { text: "Good evening", icon: Moon };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  // Get inspirational message based on time
  const getInspirationalMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12)
      return "Welcome to Walmart! Let our AI help you discover the best deals to start your day.";
    if (hour < 17)
      return "Walmart Agentic AI is ready to assist you — find what you need and enjoy a smarter shopping experience!";
    return "Unwind with Walmart: Let our AI recommend the perfect products for your evening.";
  };

  const totalPrompts = prompts.length;
  const displayedPrompts = prompts.slice(0, 4);
  const remainingCount = totalPrompts - displayedPrompts.length;

  // Default card style configuration using theme variables
  const cardClass =
    "cursor-pointer hover:bg-sidebar-foreground/2 transition-all duration-200 hover:shadow-md border-l-4 border-l-primary/20 hover:border-l-primary/70 rounded-lg bg-card text-card-foreground";
  const contentClass = "p-3 sm:p-4";
  const iconBg = "bg-primary/10 group-hover:bg-primary/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 flex flex-col h-full w-full"
    >
      {/* Greeting Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center space-y-3 mb-10"
      >
        <div className="flex items-center justify-center gap-2">
          <GreetingIcon className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-card-foreground">
            {greeting.text}!
          </h2>
        </div>
        <p className="text-sm text-foreground/80">
          {getInspirationalMessage()}
        </p>
      </motion.div>

      {/* Suggestions Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2 text-sm text-foreground/80">
          <Sparkles className="h-4 w-4" />
          <span>Try these suggestions:</span>
        </div>
        {remainingCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-foreground/80">
            <Zap className="h-3 w-3" />
            <span>+{remainingCount} more</span>
          </div>
        )}
      </motion.div>

      {/* Prompts Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {displayedPrompts.map((prompt, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileTap={{ scale: 0.98 }}
            className="group"
          >
            <Card
              className={`h-full ${cardClass}`}
              onClick={() => onPromptClick(prompt.prompt)}
            >
              <CardContent>
                {/* Default Card Layout Only */}
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${iconBg} transition-colors`}>
                    <prompt.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm mb-1 text-card-foreground">
                      {prompt.title}
                    </h3>
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      {prompt.description}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Zap className="h-3 w-3 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
