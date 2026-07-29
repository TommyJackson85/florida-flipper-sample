"use client";

import { useState } from "react";
import { PILOT_SESSION_NOTES_TEMPLATE } from "@/lib/pilot-session-notes-template";

export function CopyPilotNotesTemplateButton() {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function copyTemplate() {
    try {
      await navigator.clipboard.writeText(PILOT_SESSION_NOTES_TEMPLATE);
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
        className="doc-state-actions__btn"
        onClick={() => void copyTemplate()}
      >
        {copied ? "Copied" : "Copy session notes template"}
      </button>
      {failed ? (
        <span className="muted-note">
          Copy failed — open <code>notes/pilot/_template.md</code> instead.
        </span>
      ) : null}
    </span>
  );
}
