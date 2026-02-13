import * as React from "react";
import { cn } from "@/lib/cn";

export type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
};

export function Chip({ className, selected = false, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition",
        selected
          ? "bg-accent text-fg border border-transparent"
          : "bg-transparent text-fg-muted border border-border hover:bg-surface",
        className
      )}
      {...props}
    />
  );
}
