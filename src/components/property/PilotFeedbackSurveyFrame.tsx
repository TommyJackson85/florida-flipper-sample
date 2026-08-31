"use client";

import { useLayoutEffect, useRef, useState } from "react";
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
 */
export function PilotFeedbackSurveyFrame() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(DEFAULT_FORM_HEIGHT);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const update = () => {
      setHeight(pilotFeedbackFormHeightForWidth(el.clientWidth));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="pilot-feedback-survey__frame-wrap">
      <iframe
        className="pilot-feedback-survey__iframe"
        src={PILOT_FEEDBACK_EMBEDDED_FORM_URL}
        title="Florida Condo Screening MVP pilot feedback form"
        loading="lazy"
        scrolling="no"
        style={{ height: `${height}px` }}
      />
    </div>
  );
}
