"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  FEEDBACK_PROMPTS,
  buildFeedbackMailto,
  copyTextToClipboard,
} from "@/lib/pilot-feedback";

const COPIED_MS = 2000;

type PilotFeedbackActionsProps = {
  /** Pre-filled Google Form responder URL, or null when not configured. */
  formUrl: string | null;
};

export function PilotFeedbackActions({ formUrl }: PilotFeedbackActionsProps) {
  const fallbackId = useId();
  const closeFallbackRef = useRef<HTMLButtonElement | null>(null);
  const copiedTimerRef = useRef<number | null>(null);

  const [promptsCopied, setPromptsCopied] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  const clearCopiedTimer = useCallback(() => {
    if (copiedTimerRef.current != null) {
      window.clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearCopiedTimer();
  }, [clearCopiedTimer]);

  useEffect(() => {
    if (!showFallback) return;

    closeFallbackRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setShowFallback(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showFallback]);

  function showPromptsCopied() {
    clearCopiedTimer();
    setPromptsCopied(true);
    setStatus("Feedback prompts copied.");
    copiedTimerRef.current = window.setTimeout(() => {
      setPromptsCopied(false);
      copiedTimerRef.current = null;
    }, COPIED_MS);
  }

  async function handleCopyPrompts() {
    if (promptsCopied) return;
    const ok = await copyTextToClipboard(FEEDBACK_PROMPTS);
    if (ok) {
      setShowFallback(false);
      showPromptsCopied();
      return;
    }
    setPromptsCopied(false);
    setShowFallback(true);
    setStatus("Copying was unavailable. Select and copy the prompts below.");
  }

  function handleDraftEmail() {
    window.location.href = buildFeedbackMailto();
    setStatus(
      "Your email app should open with a draft. Review and send it when ready."
    );
  }

  return (
    <div className="pilot-feedback-actions">
      {formUrl ? (
        <div className="pilot-feedback-actions__primary">
          <a
            href={formUrl}
            className="button-primary"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the 2-minute pilot feedback form in a new tab"
          >
            Give 2-minute feedback
          </a>
          <p className="muted-note" style={{ margin: "0.4rem 0 0" }}>
            Opens in a new tab.
          </p>
        </div>
      ) : (
        <p className="muted-note" style={{ marginTop: 0 }}>
          Feedback form coming shortly. Prefer email? Send us a draft below.
        </p>
      )}

      <p className="muted-note" style={{ marginTop: "1rem", marginBottom: 0 }}>
        Prefer email or want to share screenshots?
      </p>

      <div
        className="doc-state-actions"
        style={{ marginTop: "0.5rem" }}
        role="group"
        aria-label="Email feedback"
      >
        <button
          type="button"
          className="button-secondary"
          onClick={handleDraftEmail}
        >
          Draft feedback email
        </button>
      </div>

      <p style={{ margin: "0.65rem 0 0" }}>
        <button
          type="button"
          className="pilot-feedback-actions__quiet"
          onClick={() => void handleCopyPrompts()}
          disabled={promptsCopied}
          aria-pressed={promptsCopied}
        >
          {promptsCopied ? "Copied" : "Or copy feedback questions"}
        </button>
      </p>

      <p
        className="muted-note"
        style={{ marginTop: "0.5rem", minHeight: "1.35em" }}
        aria-live="polite"
        aria-atomic="true"
      >
        {status}
      </p>

      {showFallback ? (
        <div
          id={fallbackId}
          className="pilot-feedback-fallback"
          role="region"
          aria-label="Selectable feedback text"
        >
          <p className="muted-note" style={{ marginTop: 0 }}>
            Copying was unavailable. Select and copy the prompts below.
          </p>
          <textarea
            className="pilot-feedback-fallback__text"
            readOnly
            rows={12}
            value={FEEDBACK_PROMPTS}
            aria-label="Feedback prompts text"
            onFocus={(event) => event.currentTarget.select()}
          />
          <div className="doc-state-actions" style={{ marginTop: "0.65rem" }}>
            <button
              ref={closeFallbackRef}
              type="button"
              className="button-secondary"
              onClick={() => {
                setShowFallback(false);
                setStatus(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
