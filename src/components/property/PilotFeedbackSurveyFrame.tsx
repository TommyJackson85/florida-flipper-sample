"use client";

import { useEffect, useRef, useState } from "react";
import {
  PILOT_FEEDBACK_EMBEDDED_FORM_URL,
  PILOT_FEEDBACK_FORM_HEIGHT_STEPS,
  pilotFeedbackFormHeightForWidth,
} from "@/lib/pilot-feedback";

const DEFAULT_FORM_HEIGHT =
  PILOT_FEEDBACK_FORM_HEIGHT_STEPS[PILOT_FEEDBACK_FORM_HEIGHT_STEPS.length - 1]
    .height;

/**
 * Embedded Google Form with width-aware height so the iframe never scrolls internally.
 * Heights are measured from the live form plus a safety buffer for font/zoom variance.
 *
 * The iframe mounts only on the client so SSR HTML matches the first client paint
 * (avoids hydration mismatches from dynamic height and third-party iframe attrs).
 */
export function PilotFeedbackSurveyFrame() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [height, setHeight] = useState<number>(DEFAULT_FORM_HEIGHT);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const el = wrapRef.current;
    if (!el) return;

    const update = () => {
      setHeight(pilotFeedbackFormHeightForWidth(el.clientWidth));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted]);

  return (
    <div
      ref={wrapRef}
      className="pilot-feedback-survey__frame-wrap"
      style={{ minHeight: mounted ? undefined : `${DEFAULT_FORM_HEIGHT}px` }}
    >
      {mounted ? (
        <iframe
          className="pilot-feedback-survey__iframe"
          src={PILOT_FEEDBACK_EMBEDDED_FORM_URL}
          title="Florida Condo Screening MVP pilot feedback form"
          loading="lazy"
          scrolling="no"
          style={{ height: `${height}px` }}
          suppressHydrationWarning
        />
      ) : null}
    </div>
  );
}
