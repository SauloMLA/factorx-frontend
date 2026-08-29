'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'motion';
import { useInView } from 'motion/react';

interface AnimatedNumberProps {
  value: number;
  /** Format as MXN currency */
  currency?: boolean;
  /** Format as percentage */
  percent?: boolean;
  locale?: string;
  className?: string;
  duration?: number;
}

/**
 * AnimatedNumber — Counts up to a value when it enters the viewport.
 * Uses motion's `animate()` with spring easing for a natural deceleration.
 * Emil Kowalski: the number should feel alive, not mechanical.
 */
export function AnimatedNumber({
  value,
  currency = false,
  percent = false,
  locale = 'es-MX',
  className,
  duration = 1.2,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });

  const format = (v: number) => {
    if (currency) {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(v);
    }
    if (percent) return `${v.toFixed(1)}%`;
    return new Intl.NumberFormat(locale).format(Math.round(v));
  };

  useEffect(() => {
    if (!isInView || !ref.current) return;
    const el = ref.current;

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1], // Emil's ease
      onUpdate(v) {
        el.textContent = format(v);
      },
      onComplete() {
        el.textContent = format(value);
      },
    });

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, value]);

  return (
    <span ref={ref} className={className}>
      {format(0)}
    </span>
  );
}
