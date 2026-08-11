"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PILOT_FEEDBACK_EMBEDDED_FORM_URL } from "@/lib/pilot-feedback";

/**
 * Compact end-of-review CTA. The Google Form iframe mounts only after the
 * user clicks “Give feedback” — never on page load, scroll, or a timer.
 */
export function PilotEndOfReviewFeedback() {
  // Intentionally false: dialog stays closed until the CTA is activated.
  const [dialogOpen, setDialogOpen] = useState(false);
  const headingId = useId();
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyOpenRef = useRef(false);

  useEffect(() => {
    if (!dialogOpen) {
      if (previouslyOpenRef.current) {
        triggerRef.current?.focus();
      }
      previouslyOpenRef.current = false;
      return;
    }

    previouslyOpenRef.current = true;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setDialogOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dialogOpen]);

  function openFeedbackDialog() {
    setDialogOpen(true);
  }

  function closeFeedbackDialog() {
    setDialogOpen(false);
  }

  return (
    <>
      <section
        className="pilot-end-review"
        aria-labelledby={headingId}
      >
        <h2 id={headingId} className="pilot-end-review__heading">
          Finish your review
        </h2>
        <p className="pilot-end-review__body">
          You’ve reviewed this sample property’s screening outcome, risks, and
          missing diligence. Tell us what was clear, what felt unreliable, and
          what you would need for a real deal. It takes about two minutes.
        </p>
        <button
          ref={triggerRef}
          type="button"
          className="button-primary"
          aria-haspopup="dialog"
          aria-expanded={dialogOpen}
          onClick={openFeedbackDialog}
        >
          Give feedback
        </button>
      </section>

      {dialogOpen ? (
        <div
          className="pilot-feedback-modal"
          role="presentation"
          onClick={closeFeedbackDialog}
        >
          <div
            className="pilot-feedback-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pilot-feedback-modal__header">
              <h2 id={titleId}>Pilot feedback</h2>
              <button
                ref={closeRef}
                type="button"
                className="button-secondary"
                aria-label="Close feedback form"
                onClick={closeFeedbackDialog}
              >
                Close
              </button>
            </div>
            <div className="pilot-feedback-modal__body">
              {/* Iframe exists only while the dialog is open (user-initiated). */}
              <iframe
                className="pilot-feedback-modal__iframe"
                src={PILOT_FEEDBACK_EMBEDDED_FORM_URL}
                title="Florida Condo Screening MVP pilot feedback form"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
