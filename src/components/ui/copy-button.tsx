"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
  onCopied?: () => void;
}

export function CopyButton({
  text,
  variant = "outline",
  size = "sm",
  className = "",
  children,
  onCopied,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      if (typeof navigator !== "undefined" && "clipboard" in navigator) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      if (onCopied) onCopied();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={copyToClipboard}
      className={className}
      title="Copy to clipboard"
    >
      {children || (
        <>
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "Copied!" : "Copy"}
        </>
      )}
    </Button>
  );
}
