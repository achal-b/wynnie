"use client";

import {
  FiChevronRight,
  FiUser,
  FiBell,
  FiShield,
  FiLogOut,
  FiTrash,
  FiHelpCircle,
} from "react-icons/fi";
import { motion } from "motion/react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const userSettings = [
  {
    title: "Profile Information",
    description: "Manage your profile information",
    icon: FiUser,
    href: "/dashboard/settings/profile",
    recommended: true,
  },
  {
    title: "2FA Authentication",
    description: "Enable or disable 2FA authentication",
    icon: FiShield,
    href: "#",
    recommended: false,
  },
];

const additionalSettings = [
  {
    title: "App Preferences",
    description: "Manage your notifications preferences",
    icon: FiBell,
    href: "/dashboard/settings/preferences",
    recommended: false,
  },
  {
    title: "Privacy Policy",
    description: "How we protect your data",
    icon: FiShield,
    href: "/dashboard/settings/privacy-policy",
    recommended: false,
  },
  {
    title: "Help & Support",
    description: "Get help with your orders",
    icon: FiHelpCircle,
    href: "/dashboard/settings/support",
    recommended: false,
  },
];

const dangerZone = [
  {
    title: "Log out",
    description: "Sign out of your account",
    icon: FiLogOut,
    href: "/login",
    recommended: false,
  },
  {
    title: "Delete Account",
    description: "Permanently delete your account",
    icon: FiTrash,
    href: "#",
    recommended: false,
  },
];

export default function SettingsPage() {
  let animationDelay = 0;

  return (
    <div className="bg-background font-light">
      <div className="space-y-10">
        {/* Security Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 mt-3 md:mt-0">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-walmart-true-blue/10 dark:bg-walmart-true-blue/20">
                <FiShield className="h-4 w-4 text-walmart-true-blue" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-foreground">
                  Account Security
                </h3>
                <p className="text-xs text-foreground/80 mt-1">
                  Manage your account settings and security preferences
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* User Settings */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: animationDelay / 1000,
            duration: 0.5,
            ease: "easeOut",
          }}
        >
          <h2 className="text-base font-medium text-foreground">
            User Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userSettings.map((item, idx) => {
              animationDelay += 100;
              const Icon = item.icon;

              return (
                <Link href={item.href} key={idx}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: animationDelay / 1000,
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  >
                    <Card className="cursor-pointer transition-all duration-200 border-border hover:border-walmart-true-blue/30 hover:shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-walmart-sky-blue/20 dark:bg-walmart-true-blue/10">
                          <Icon className="h-4 w-4 text-walmart-true-blue" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm text-foreground">
                              {item.title}
                            </h3>
                            {item.recommended && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-2 py-0.5 bg-walmart-true-blue/10 text-walmart-true-blue border-walmart-true-blue/20 dark:bg-walmart-sky-blue/20 dark:text-walmart-sky-blue dark:border-walmart-sky-blue/30"
                              >
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-foreground/80 mt-0.5">
                            {item.description}
                          </p>
                        </div>

                        <FiChevronRight className="h-4 w-4 text-foreground/80" />
                      </div>
                    </Card>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Additional Settings */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: animationDelay / 1000,
            duration: 0.5,
            ease: "easeOut",
          }}
        >
          <h2 className="text-base font-medium text-foreground">
            Additional Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {additionalSettings.map((item, idx) => {
              animationDelay += 100;
              const Icon = item.icon;

              return (
                <Link href={item.href} key={idx}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: animationDelay / 1000,
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  >
                    <Card className="cursor-pointer transition-all duration-200 border-border hover:border-walmart-true-blue/30 hover:shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-walmart-sky-blue/20 dark:bg-walmart-true-blue/10">
                          <Icon className="h-4 w-4 text-walmart-true-blue" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm text-foreground">
                              {item.title}
                            </h3>
                            {item.recommended && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-2 py-0.5 bg-walmart-true-blue/10 text-walmart-true-blue border-walmart-true-blue/20 dark:bg-walmart-sky-blue/20 dark:text-walmart-sky-blue dark:border-walmart-sky-blue/30"
                              >
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-foreground/80 mt-0.5">
                            {item.description}
                          </p>
                        </div>

                        <FiChevronRight className="h-4 w-4 text-foreground/80" />
                      </div>
                    </Card>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: animationDelay / 1000,
            duration: 0.5,
            ease: "easeOut",
          }}
        >
          <h2 className="text-base font-medium text-destructive">
            Danger Zone
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dangerZone.map((item, idx) => {
              animationDelay += 100;
              const Icon = item.icon;

              return (
                <Link href={item.href} key={idx}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: animationDelay / 1000,
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  >
                    <Card className="cursor-pointer transition-all duration-200 border-destructive/30 hover:border-destructive/50 hover:shadow-sm bg-destructive/5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-destructive/10">
                          <Icon className="h-4 w-4 text-destructive" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm text-destructive">
                              {item.title}
                            </h3>
                            {item.recommended && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-2 py-0.5 bg-destructive/10 text-destructive border-destructive/20"
                              >
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-destructive/70 mt-0.5">
                            {item.description}
                          </p>
                        </div>

                        <FiChevronRight className="h-4 w-4 text-destructive/70" />
                      </div>
                    </Card>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
