"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={{
        "--normal-bg": "#FFFFFF",
        "--normal-text": "var(--foreground)",
        "--normal-border": "var(--border)",
        "--success-bg": "#FFFFFF",
        "--success-border": "var(--primary)",
        "--success-text": "var(--primary)",
        "--error-bg": "#FFFFFF",
        "--error-border": "var(--destructive)",
        "--error-text": "var(--destructive)",
        "--description-color": "var(--primary)",
      }}
      toastOptions={{
        classNames: {
          toast: "group rounded-lg border shadow-md",
          title: "font-medium text-foreground",
          description: "text-sm text-muted-foreground",
          success: "border-l-4 border-l-primary",
          error: "border-l-4 border-l-destructive",
          actionButton: "bg-primary text-primary-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
