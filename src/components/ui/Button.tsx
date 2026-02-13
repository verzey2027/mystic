import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  "transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-accent-hover",
  secondary: "bg-surface-2 text-fg border border-border hover:border-border-strong",
  ghost: "bg-transparent text-fg border border-border hover:bg-surface-2",
  danger: "bg-danger/15 text-fg border border-danger/40 hover:bg-danger/25",
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
