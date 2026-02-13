import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold " +
  "transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-accent-hover",
  secondary: "bg-bg-elevated text-fg border border-border hover:border-border-strong",
  ghost: "bg-transparent text-fg-muted border border-border hover:bg-surface hover:text-fg",
  danger: "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}
