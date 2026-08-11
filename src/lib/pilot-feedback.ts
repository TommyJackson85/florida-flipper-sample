/**
 * Trial pilot feedback — client-side Google Form link, mailto, and clipboard.
 * The app never submits to Google Forms or sends email itself.
 */

const FORM_URL_PLACEHOLDER = "REPLACE_WITH_PREFILLED_FORM_URL";

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

export const FEEDBACK_PROMPTS = `Florida condo screening pilot feedback

Property reviewed: 7863 Niagara Ave #1921

1. What was useful or immediately clear?
2. What was confusing, missing, or hard to trust?
3. What would you need before using this on a real deal?

Optional: Include screenshots or the section names you are referring to.`;

export const FEEDBACK_EMAIL_SUBJECT =
  "Feedback: Florida condo screening pilot";

export const FEEDBACK_EMAIL_BODY = `Hi,

I reviewed the Florida condo screening pilot for 7863 Niagara Ave #1921.

1. What was useful or immediately clear?
2. What was confusing, missing, or hard to trust?
3. What would you need before using this on a real deal?

Optional: Please include screenshots or the section names you are referring to.

Thanks,`;

/** Subject + body for clipboard when mailto is unavailable. */
export function formatFeedbackEmailDraft(): string {
  return `Subject: ${FEEDBACK_EMAIL_SUBJECT}\n\n${FEEDBACK_EMAIL_BODY}`;
}

/**
 * Build a mailto URL with URL-encoded subject and body.
 * Recipient stays blank unless an explicit address is passed.
 */
export function buildFeedbackMailto(recipient = ""): string {
  const subject = encodeURIComponent(FEEDBACK_EMAIL_SUBJECT);
  const body = encodeURIComponent(FEEDBACK_EMAIL_BODY);
  return `mailto:${recipient}?subject=${subject}&body=${body}`;
}

/**
 * Public pre-filled Google Form responder URL from env.
 * Returns null when missing, blank, placeholder, or not a valid http(s) URL.
 */
export function getPilotFeedbackFormUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_PILOT_FEEDBACK_FORM_URL?.trim() ?? "";
  if (!raw || raw.includes(FORM_URL_PLACEHOLDER)) {
    return null;
  }
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }
    return raw;
  } catch {
    return null;
  }
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (
      typeof navigator === "undefined" ||
      !navigator.clipboard ||
      typeof navigator.clipboard.writeText !== "function"
    ) {
      return false;
    }
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
