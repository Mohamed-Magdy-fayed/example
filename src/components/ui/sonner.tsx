"use client";

import {
  AlertTriangle,
  CheckCircle,
  Info,
  Loader,
  XCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CheckCircle className="size-4" strokeWidth={2} />,
        info: <Info className="size-4" strokeWidth={2} />,
        warning: <AlertTriangle className="size-4" strokeWidth={2} />,
        error: <XCircle className="size-4" strokeWidth={2} />,
        loading: <Loader className="size-4 animate-spin" strokeWidth={2} />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      theme={theme as ToasterProps["theme"]}
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
