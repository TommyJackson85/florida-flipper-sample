/**
 * Pilot feedback helpers for the end-of-deal-review embedded Google Form.
 * The app never submits to Google Forms itself — the iframe posts to Google.
 */

/** Google Form document id for the pilot feedback questionnaire. */
export const PILOT_FEEDBACK_FORM_ID =
  "100PIDFDsuvWrhZQShY8TTWkbp6TqdQVLzf4dKpeeWP0";

/**
 * Embedded responder URL for in-app iframe (not /preview, not the editor).
 * Submissions stay on Google Forms; the app does not read responses.
 */
export const PILOT_FEEDBACK_EMBEDDED_FORM_URL = `https://docs.google.com/forms/d/${PILOT_FEEDBACK_FORM_ID}/viewform?embedded=true`;

/** Catalog ids that get the end-of-review embedded feedback CTA. */
const PILOT_END_OF_REVIEW_PROPERTY_IDS = new Set([
  "7863-niagara-1921",
  "2200-e-fowler-ave-b12",
]);

/**
 * Niagara (Track) and Fowler (Pass) only — never Cypress / Sample shells.
 * In TRIAL_BUILD, Fowler remains catalog-hidden, so pilots only see this on Niagara.
 */
export function showPilotEndOfReviewFeedback(property: {
  id: string;
  isSample?: boolean;
}): boolean {
  if (property.isSample) return false;
  return PILOT_END_OF_REVIEW_PROPERTY_IDS.has(property.id);
}

/** Same pilot examples as end-of-review feedback — Niagara and Fowler only. */
export function showPilotReviewGuidance(property: {
  id: string;
  isSample?: boolean;
}): boolean {
  return showPilotEndOfReviewFeedback(property);
}
