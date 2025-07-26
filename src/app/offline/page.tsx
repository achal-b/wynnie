import { Metadata } from "next";
import { TryAgainButton } from "@/components/TryAgainButton";
import { Card } from "@/components/ui/card";
import * as motion from "motion/react-client";
import { Wifi, WifiOff, CheckCircle, Clock, ShoppingCart } from "lucide-react";

export const metadata: Metadata = {
  title: "Offline - Wynnie",
  description: "You're offline. Wynnie will be ready when you're back online.",
};

export default function OfflinePage() {
  return (
    <div className=" bg-background flex flex-col items-center justify-center p-6 font-light">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-lg mx-auto space-y-8"
      >
        {/* Main Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-walmart-true-blue/10 to-walmart-sky-blue/10 flex items-center justify-center">
            <WifiOff className="w-16 h-16 text-walmart-true-blue" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-walmart-spark-yellow rounded-full flex items-center justify-center">
            <Clock className="w-4 h-4 text-walmart-everyday-blue" />
          </div>
        </motion.div>

        {/* Title and Description */}
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl font-bold text-foreground"
          >
            You're Offline
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-foreground/80 leading-relaxed"
          >
            Don't worry! Your data is safe and Wynnie will be ready to help when
            you're back online.
          </motion.p>
        </div>

        {/* Features Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Your app data is safely stored
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-walmart-sky-blue/20 dark:bg-walmart-sky-blue/10">
                  <Wifi className="h-4 w-4 text-walmart-sky-blue" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Previous conversations are available
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-walmart-spark-yellow/20 dark:bg-walmart-spark-yellow/10">
                  <ShoppingCart className="h-4 w-4 text-walmart-everyday-blue" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Cart items are preserved
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Try Again Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <TryAgainButton className="bg-walmart-true-blue hover:bg-walmart-true-blue/90 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
            Try Again
          </TryAgainButton>
        </motion.div>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex items-center justify-center gap-2 text-xs text-foreground/60"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span>No internet connection</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
