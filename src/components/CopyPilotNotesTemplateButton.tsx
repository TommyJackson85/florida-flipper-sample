"use client";

import { useState } from "react";

/** Short prompts for pilot users — not the operator session-note template. */
const PILOT_FEEDBACK_PROMPTS = [
  "Deal Screen pilot feedback",
  "",
  "1. Was the screening format clear and trustworthy?",
  "",
  "2. If you could enter one of your own deals and receive a screen like this, what minimum information would you be willing to provide?",
  "",
  "3. What was missing, confusing, or hard to trust?",
  "",
].join("\n");

export function CopyPilotNotesTemplateButton() {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function copyTemplate() {
    try {
      await navigator.clipboard.writeText(PILOT_FEEDBACK_PROMPTS);
      setCopied(true);
      setFailed(false);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setFailed(true);
      setCopied(false);
    }
  }

  return (
    <span style={{ display: "inline-flex", flexDirection: "column", gap: 4 }}>
      <button
        type="button"
        className="button-secondary"
        onClick={() => void copyTemplate()}
      >
        {copied ? "Copied" : "Copy feedback prompts"}
      </button>
      {failed ? (
        <span className="muted-note">
          Copy failed — use Draft feedback email instead.
        </span>
      ) : null}
    </span>
  );
}
