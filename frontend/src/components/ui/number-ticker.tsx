import { type CSSProperties, type ComponentPropsWithoutRef, useEffect, useRef } from "react";
import { useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

if (typeof globalThis !== "undefined" && typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = class FallbackIntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = "0px";
    readonly thresholds: ReadonlyArray<number> = [0];
    private callback: IntersectionObserverCallback;
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }
    observe(target: Element) {
      this.callback(
        [{ isIntersecting: true, target } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      );
    }
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  };
}

export interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number;
  startValue?: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
  locale?: string;
}


const srOnlyStyle: CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  locale = "id-ID",
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const displayRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const initialValue = direction === "down" ? value : startValue;
  const targetValue = direction === "down" ? startValue : value;

  const formatNumber = (num: number) =>
    Intl.NumberFormat(locale, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(Number(num.toFixed(decimalPlaces)));

  const currentDisplayRef = useRef(
    formatNumber(reducedMotion || targetValue === initialValue ? targetValue : initialValue),
  );
  const motionValue = useMotionValue(reducedMotion ? targetValue : initialValue);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (reducedMotion) {
      motionValue.set(targetValue);
      const formatted = formatNumber(targetValue);
      currentDisplayRef.current = formatted;
      displayRef.current?.setAttribute("data-ticker-value", formatted);
      return;
    }
    if (!isInView) return;

    const effectiveDelay = hasAnimatedRef.current ? 0 : delay;
    const timer = setTimeout(() => {
      hasAnimatedRef.current = true;
      motionValue.set(targetValue);
    }, effectiveDelay * 1000);
    return () => clearTimeout(timer);
  }, [motionValue, isInView, delay, targetValue, reducedMotion, decimalPlaces, locale]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        const formatted = formatNumber(latest);
        currentDisplayRef.current = formatted;
        displayRef.current?.setAttribute("data-ticker-value", formatted);
      }),
    [springValue, decimalPlaces, locale],
  );

  return (
    <span
      ref={ref}
      className={cn("inline-block tabular-nums tracking-tight number-ticker", className)}
      data-ticker-target={targetValue}
      {...props}
    >
      <span className="number-ticker-sr" style={srOnlyStyle}>
        {formatNumber(targetValue)}
      </span>
      <span
        ref={displayRef}
        className="number-ticker-visual"
        aria-hidden="true"
        data-ticker-value={currentDisplayRef.current}
      />
    </span>
  );
}

