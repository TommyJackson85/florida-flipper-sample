"use client";

import { useId } from "react";
import {
  PILOT_FEEDBACK_CALLOUT_BODY,
  PILOT_FEEDBACK_CALLOUT_BUTTON,
  PILOT_FEEDBACK_CALLOUT_HEADING,
  PILOT_FEEDBACK_SURVEY_HEADING_ID,
  PILOT_FEEDBACK_SURVEY_ID,
} from "@/lib/pilot-feedback";
import { PilotFeedbackSurveyFrame } from "./PilotFeedbackSurveyFrame";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function focusSurveyHeading() {
  const heading = document.getElementById(PILOT_FEEDBACK_SURVEY_HEADING_ID);
  if (!heading) return;
  if (!heading.hasAttribute("tabindex")) {
    heading.tabIndex = -1;
  }
  heading.focus({ preventScroll: true });
}

/** Smooth-scroll to the embedded survey, then move keyboard focus to its heading. */
export function scrollToPilotFeedbackSurvey() {
  const survey = document.getElementById(PILOT_FEEDBACK_SURVEY_ID);
  if (!survey) return;

  const reduced = prefersReducedMotion();
  survey.scrollIntoView({
    behavior: reduced ? "auto" : "smooth",
    block: "start",
  });

  if (reduced) {
    focusSurveyHeading();
    return;
  }

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    focusSurveyHeading();
  };

  document.addEventListener("scrollend", finish, { once: true });
  window.setTimeout(finish, 700);
}

type PilotFeedbackCalloutProps = {
  /** Optional id when multiple callouts are on the page */
  id?: string;
};

/**
 * Compact feedback CTA. Scrolls to the embedded survey — never opens a modal.
 */
export function PilotFeedbackCallout({ id }: PilotFeedbackCalloutProps) {
  const reactId = useId();
  const headingId = id ? `${id}-heading` : `${reactId}-heading`;

  return (
    <aside
      id={id}
      className="pilot-feedback-callout"
      aria-labelledby={headingId}
    >
      <div className="pilot-feedback-callout__copy">
        <h2 id={headingId} className="pilot-feedback-callout__heading">
          {PILOT_FEEDBACK_CALLOUT_HEADING}
        </h2>
        <p className="pilot-feedback-callout__body">
          {PILOT_FEEDBACK_CALLOUT_BODY}
        </p>
      </div>
      <button
        type="button"
        className="button-primary pilot-feedback-callout__button"
        onClick={scrollToPilotFeedbackSurvey}
      >
        {PILOT_FEEDBACK_CALLOUT_BUTTON}
      </button>
    </aside>
  );
}

/**
 * Embedded Google Form survey at the bottom of the deal page.
 * Mounted in-page only — no modal, no auto-open popup.
 */
export function PilotFeedbackSurvey() {
  return (
    <section
      id={PILOT_FEEDBACK_SURVEY_ID}
      className="pilot-feedback-survey"
      aria-labelledby={PILOT_FEEDBACK_SURVEY_HEADING_ID}
    >
      <h2
        id={PILOT_FEEDBACK_SURVEY_HEADING_ID}
        className="pilot-feedback-survey__heading"
      >
        Pilot feedback survey
      </h2>
      <p className="pilot-feedback-survey__lede muted-note">
        About 45 seconds. Responses go to the Condo Clear pilot form — this app
        does not store your answers.
      </p>
      <PilotFeedbackSurveyFrame />
    </section>
  );
}

/**
 * Bottom-of-page embedded survey (CTA sits above accordions on the deal screen).
 */
export function PilotEndOfReviewFeedback() {
  return (
    <div className="pilot-feedback-footer">
      <PilotFeedbackSurvey />
    </div>
  );
}
