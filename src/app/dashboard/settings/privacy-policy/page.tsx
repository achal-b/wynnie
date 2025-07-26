"use client";

import { motion } from "motion/react";

export default function PrivacyPolicyPage() {
  return (
    <motion.div
      className="space-y-10 font-light"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex flex-col gap-5">
        <div className="text-sm text-foreground/90 bg-card rounded-lg hover:border-walmart-true-blue/30 transition-all duration-200">
          We value your privacy and are committed to protecting your personal
          information. This page explains how we collect, use, and safeguard
          your data when you use our services.
        </div>
        <ul className="list-disc pl-6 text-sm text-foreground/80 mt-4 space-y-2 bg-card rounded-lg hover:border-walmart-true-blue/30 transition-all duration-200">
          <li>
            We only collect information necessary to provide our services.
          </li>
          <li>
            Your data is stored securely and is never sold to third parties.
          </li>
          <li>
            You can request to view, update, or delete your personal information
            at any time.
          </li>
          <li>For more details, please contact our support team.</li>
        </ul>
        <div className="mt-6 text-xs text-foreground/60 bg-card/50 p-3 border border-border rounded-lg hover:border-walmart-true-blue/30 transition-all duration-200">
          Last updated: June 2024
        </div>
      </div>
    </motion.div>
  );
}
