import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...values: ClassValue[]) => twMerge(clsx(values));
const buttonVariants = cva("fx-button inline-flex items-center justify-center gap-2 rounded-xl font-semibold", {
  variants: {
    variant: { primary: "fx-button-primary", secondary: "fx-button-secondary", ghost: "fx-button-ghost" },
    size: { default: "px-4 py-2.5 text-xs", icon: "size-9 p-2", small: "px-3 py-2 text-[11px]" },
  },
  defaultVariants: { variant: "secondary", size: "default" },
});
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean; shimmer?: boolean };
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, shimmer = false, children, ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    return <Component ref={ref} className={cn(buttonVariants({ variant, size }), shimmer && "fx-shimmer", className)} {...props}>{children}</Component>;
  },
);
Button.displayName = "Button";
export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
  <div className={cn("fx-card rounded-2xl border bg-white", className)} {...props} />;
export const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) =>
  <span className={cn("fx-badge inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px]", className)}>{children}</span>;
