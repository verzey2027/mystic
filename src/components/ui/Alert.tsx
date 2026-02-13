import * as React from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

const tones: Record<Tone, string> = {
  neutral: "border-border bg-surface text-fg",
  success: "border-success/30 bg-success/10 text-fg",
  warning: "border-warning/30 bg-warning/10 text-fg",
  danger: "border-danger/30 bg-danger/10 text-fg",
  info: "border-teal/30 bg-teal/10 text-fg",
};

export function Alert({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { tone?: Tone }) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 text-sm",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
