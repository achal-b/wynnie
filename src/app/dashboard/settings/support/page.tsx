"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Phone, Mail, Search, ChevronRight } from "lucide-react";
import { CartModal } from "@/components/CartModal";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";

const faqItems = [
  {
    question: "How do I track my order?",
    answer:
      "You can track your order in the Orders section or ask our AI assistant.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI, Credit/Debit cards, Net Banking, and Digital Wallets.",
  },
  {
    question: "How do I cancel an order?",
    answer: "Orders can be cancelled within 30 minutes of placing them.",
  },
  {
    question: "What is your return policy?",
    answer: "We offer 7-day returns for most products with original packaging.",
  },
];

export default function SupportPage() {
  return (
    <div className="bg-background w-full space-y-10 pb-5">
      <div className="space-y-6">
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/60" />
          <Input
            placeholder="Search for help..."
            className="pl-10 bg-background  text-foreground placeholder:text-foreground/60 focus:border-walmart-true-blue/50 focus:ring-walmart-true-blue/20"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-card py-3 px-4 rounded-lg cursor-pointer hover:bg-walmart-sky-blue/10 dark:hover:bg-walmart-true-blue/10 transition-all duration-200 w-full flex flex-row items-center gap-2 border  hover:border-walmart-true-blue/30">
            <MessageCircle className="h-4 w-4 text-walmart-true-blue" />
            <p className="text-sm text-foreground">Live Chat</p>
          </div>
          <div className="bg-card py-3 px-4 rounded-lg cursor-pointer hover:bg-walmart-sky-blue/10 dark:hover:bg-walmart-true-blue/10 transition-all duration-200 w-full flex flex-row items-center gap-2 border  hover:border-walmart-true-blue/30">
            <Phone className="h-4 w-4 text-walmart-true-blue" />
            <p className="text-sm text-foreground">Call Us</p>
          </div>
          <div className="bg-card py-3 px-4 rounded-lg cursor-pointer hover:bg-walmart-sky-blue/10 dark:hover:bg-walmart-true-blue/10 transition-all duration-200 w-full flex flex-row items-center gap-3 border  hover:border-walmart-true-blue/30">
            <Mail className="h-4 w-4 text-walmart-true-blue" />
            <p className="text-sm text-foreground">Email</p>
          </div>
        </div>

        {/* FAQ */}
        <Card className=" bg-card">
          <CardHeader>
            <CardTitle className="text- text-foreground">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="border-b  last:border-0 pb-3 last:pb-0 "
            >
              <div className="flex items-center justify-between cursor-pointer">
                <p className="font-medium text-sm text-foreground">
                  {item.question}
                </p>
              </div>
              <p className="text-xs text-foreground/80 mt-1">{item.answer}</p>
            </div>
          ))}
        </Card>

        {/* Contact Form */}
        <Card className=" bg-card">
          <CardHeader>
            <CardTitle className="text-base text-foreground">
              Contact Us
            </CardTitle>
          </CardHeader>
          <div className="space-y-3 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Your Name"
                className="bg-background  text-foreground placeholder:text-foreground/60 focus:border-walmart-true-blue/50 focus:ring-walmart-true-blue/20"
              />
              <Input
                placeholder="Your Email"
                type="email"
                className="bg-background  text-foreground placeholder:text-foreground/60 focus:border-walmart-true-blue/50 focus:ring-walmart-true-blue/20"
              />
            </div>
            <Input
              placeholder="Subject"
              className="bg-background  text-foreground placeholder:text-foreground/60 focus:border-walmart-true-blue/50 focus:ring-walmart-true-blue/20"
            />
            <Textarea
              placeholder="Describe your issue..."
              rows={5}
              className="bg-background  text-foreground placeholder:text-foreground/60 focus:border-walmart-true-blue/50 focus:ring-walmart-true-blue/20"
            />
            <Button className="w-full bg-walmart-true-blue hover:bg-walmart-bentonville-blue text-white">
              Send Message
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
