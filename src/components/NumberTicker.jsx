import { useEffect, useRef, useState } from 'react';

/**
 * Magic UI NumberTicker Component
 * Reference: https://magicui.design/docs/components/number-ticker
 *
 * Smoothly animates numbers transitioning from startValue (default 0) to value.
 *
 * @param {number} value - The target number to animate to
 * @param {number} startValue - The starting value (default: 0)
 * @param {string} direction - "up" | "down" (default: "up")
 * @param {number} delay - Delay in seconds before animation begins (default: 0)
 * @param {number} duration - Animation duration in milliseconds (default: 1500)
 * @param {number} decimalPlaces - Number of decimal digits to display (default: 0)
 * @param {string} className - Additional CSS class
 * @param {object} style - Additional inline styles
 */
export default function NumberTicker({
  value = 0,
  startValue = 0,
  direction = 'up',
  delay = 0,
  duration = 1500,
  decimalPlaces = 0,
  className = '',
  style = {}
}) {
  const [displayValue, setDisplayValue] = useState(
    direction === 'down' ? value : startValue
  );
  const spanRef = useRef(null);

  useEffect(() => {
    let animFrameId = null;
    let timeoutId = null;

    const targetVal = Number(value) || 0;
    const initialVal = Number(startValue) || 0;
    const start = direction === 'down' ? targetVal : initialVal;
    const end = direction === 'down' ? initialVal : targetVal;

    timeoutId = setTimeout(() => {
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Quintic ease-out deceleration curve for ultra smooth countdown/up
        const ease = 1 - Math.pow(1 - progress, 5);
        const current = start + (end - start) * ease;

        setDisplayValue(current);

        if (progress < 1) {
          animFrameId = requestAnimationFrame(animate);
        } else {
          setDisplayValue(end);
        }
      };

      animFrameId = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [value, startValue, direction, delay, duration]);

  const formatted = Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(Number(displayValue.toFixed(decimalPlaces)));

  return (
    <span
      ref={spanRef}
      className={`inline-block tabular-nums tracking-normal ${className}`}
      style={{
        fontVariantNumeric: 'tabular-nums',
        display: 'inline-block',
        ...style
      }}
    >
      {formatted}
    </span>
  );
}
