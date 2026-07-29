"use client";

import { useState } from "react";
import type { PropertyScreen } from "@/types/property";
import { buildPropertyExportSummary } from "@/lib/property-export-summary";
import { SectionCard } from "./SectionCard";

type PropertyExportSummaryCardProps = {
  property: PropertyScreen;
};

export function PropertyExportSummaryCard({
  property,
}: PropertyExportSummaryCardProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const summary = buildPropertyExportSummary(property);

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  }

  return (
    <SectionCard
      title="Export summary"
      subtitle="Copy a concise seed snapshot for review — not a full report."
    >
      <div
        className="doc-state-actions"
        style={{ marginBottom: "0.5rem" }}
        role="group"
        aria-label="Export summary actions"
      >
        <button
          type="button"
          className="doc-state-actions__btn"
          onClick={copySummary}
        >
          Copy summary
        </button>
      </div>
      {copied ? (
        <p className="muted-note">Copied to clipboard.</p>
      ) : null}
      {copyError ? (
        <p className="muted-note">
          Copy failed — select and copy manually.
        </p>
      ) : null}
      <pre
        className="muted-note"
        style={{
          margin: copyError || copied ? "0.5rem 0 0" : 0,
          whiteSpace: "pre-wrap",
          fontFamily: "inherit",
          fontSize: 13,
        }}
      >
        {summary}
      </pre>
    </SectionCard>
  );
}
