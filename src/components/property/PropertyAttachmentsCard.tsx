"use client";

import { useRef, useState } from "react";
import type { PropertyScreen } from "@/types/property";
import { SectionCard } from "./SectionCard";

type PropertyAttachmentsCardProps = {
  property: PropertyScreen;
};

type AttachmentEntry = {
  id: string;
  name: string;
  sizeBytes: number;
  addedAt: number;
  file: File;
};

function formatBytes(sizeBytes: number): string {
  if (sizeBytes < 1024) return `${sizeBytes} B`;
  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(sizeBytes < 10 * 1024 ? 1 : 0)} KB`;
  }
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatAddedAt(at: number): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(at));
}

export function PropertyAttachmentsCard({
  property,
}: PropertyAttachmentsCardProps) {
  if (property.isSample) {
    return (
      <SectionCard
        title="Attachments"
        subtitle="Demo files associated with this deal screen — not the missing-documents tracker."
      >
        <p className="muted-note">
          Practice shell — attachments not used on samples.
        </p>
      </SectionCard>
    );
  }

  return <AttachmentsInteractive />;
}

function AttachmentsInteractive() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<AttachmentEntry[]>([]);

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const next = Array.from(fileList).map((file, index) => ({
      id: `${Date.now()}-${index}-${file.name}`,
      name: file.name,
      sizeBytes: file.size,
      addedAt: Date.now(),
      file,
    }));
    setAttachments((prev) => [...next, ...prev]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => prev.filter((entry) => entry.id !== id));
  }

  function openAttachment(entry: AttachmentEntry) {
    const url = URL.createObjectURL(entry.file);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  return (
    <SectionCard
      title="Attachments"
      subtitle="Demo only — files stay in this browser tab until refresh; nothing is uploaded."
    >
      <div
        className="doc-state-actions"
        style={{ marginBottom: "0.5rem" }}
        role="group"
        aria-label="Attachment actions"
      >
        <button
          type="button"
          className="doc-state-actions__btn"
          onClick={() => inputRef.current?.click()}
        >
          Add files
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(event) => addFiles(event.target.files)}
        />
      </div>
      <p className="muted-note" style={{ marginBottom: "0.75rem" }}>
        Separate from Missing documents (status only) and Sources local path
        notes.
      </p>
      {attachments.length === 0 ? (
        <p className="muted-note">
          No attachments yet. Add a file for this browser tab only.
        </p>
      ) : (
        <ul className="risk-flag-list">
          {attachments.map((entry) => (
            <li key={entry.id} className="risk-flag-row">
              <div className="risk-flag-row__main">
                <span className="risk-flag-row__label">{entry.name}</span>
                <span className="muted-note">
                  {formatBytes(entry.sizeBytes)} · added{" "}
                  {formatAddedAt(entry.addedAt)}
                </span>
              </div>
              <div
                className="doc-state-actions"
                role="group"
                aria-label={`${entry.name} actions`}
              >
                <button
                  type="button"
                  className="doc-state-actions__btn"
                  onClick={() => openAttachment(entry)}
                >
                  Open
                </button>
                <button
                  type="button"
                  className="doc-state-actions__btn"
                  onClick={() => removeAttachment(entry.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
