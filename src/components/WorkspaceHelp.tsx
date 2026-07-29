"use client";

import { useEffect, useId, useRef, useState } from "react";
import { resetDemoData } from "@/lib/demo-reset";
import {
  diagnoseTransfer,
  diagnoseWorkspace,
  formatDiagnosticSummary,
  type DiagnosticIssue,
} from "@/lib/workspace-diagnostics";
import {
  applyWorkspaceTransfer,
  downloadWorkspaceTransfer,
  parseWorkspaceTransfer,
} from "@/lib/workspace-transfer";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return target.isContentEditable;
}

const RESET_CONFIRM =
  "Clear this tab’s pins, archives, tags, intake stub, and recents, then reload to the seeded sample state? Unsaved on-screen toggles will be lost.";

const IMPORT_CONFIRM =
  "Replace this tab’s session overlays with the file, then reload? Seed properties on disk stay unchanged. Attachments and other on-screen demo toggles are not included.";

export function WorkspaceHelp() {
  const [open, setOpen] = useState(false);
  const [diagnosticIssues, setDiagnosticIssues] = useState<
    DiagnosticIssue[] | null
  >(null);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  function handleResetDemoData() {
    if (!window.confirm(RESET_CONFIRM)) return;
    resetDemoData();
    window.location.reload();
  }

  function handleExportWorkspace() {
    downloadWorkspaceTransfer();
  }

  function handleRunDiagnostics() {
    setDiagnosticIssues(diagnoseWorkspace());
  }

  function handleImportPick() {
    importInputRef.current?.click();
  }

  async function handleImportFile(fileList: FileList | null) {
    const file = fileList?.[0];
    if (importInputRef.current) {
      importInputRef.current.value = "";
    }
    if (!file) return;

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(await file.text()) as unknown;
    } catch {
      window.alert("Could not read that file as JSON.");
      return;
    }

    const result = parseWorkspaceTransfer(parsedJson);
    if (!result.ok) {
      window.alert(result.error);
      return;
    }

    const issues = diagnoseTransfer(result.payload);
    if (issues.length > 0) {
      const warn = `${formatDiagnosticSummary(issues)}\n\nImport anyway?\n\n${IMPORT_CONFIRM}`;
      if (!window.confirm(warn)) return;
    } else if (!window.confirm(IMPORT_CONFIRM)) {
      return;
    }

    applyWorkspaceTransfer(result.payload);
    window.location.reload();
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (
        event.key === "?" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !isTypingTarget(event.target)
      ) {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setDiagnosticIssues(null);
      return;
    }
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="site-nav__help"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        Help
      </button>

      {open ? (
        <div
          className="workspace-help"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            className="workspace-help__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="workspace-help__header">
              <div>
                <h2 id={titleId}>How to use this workspace</h2>
                <p className="muted-note" style={{ marginTop: "0.35rem" }}>
                  Demo tips for this file-based deal screen — not a product tour.
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                className="doc-state-actions__btn"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="workspace-help__body">
              <section>
                <h3>Navigate</h3>
                <ul>
                  <li>
                    <strong>Home</strong> — intro and entry points
                  </li>
                  <li>
                    <strong>Properties</strong> — workspace overview, list, and
                    board
                  </li>
                  <li>
                    <strong>Intake</strong> — generate a new property stub
                  </li>
                  <li>
                    Open a deal for the full screen; use{" "}
                    <strong>Preview client status</strong> for the curated
                    read-only page
                  </li>
                </ul>
              </section>

              <section>
                <h3>Workspace tools</h3>
                <ul>
                  <li>
                    <strong>Overview</strong> — counts and needs-attention /
                    dates-due / post-close groups
                  </li>
                  <li>
                    <strong>Recently viewed</strong> — last deals opened this
                    browsing session (clears on refresh)
                  </li>
                  <li>
                    <strong>Quick actions</strong> — jump to intake, board,
                    pinned, archived, or needs attention
                  </li>
                  <li>
                    <strong>View presets</strong> — All active, Needs attention,
                    Dates due, Post-close, Pinned
                  </li>
                  <li>
                    <strong>List · Board</strong> — same filtered pool; board
                    stage moves reset on refresh
                  </li>
                </ul>
              </section>

              <section>
                <h3>Selection &amp; bulk</h3>
                <ul>
                  <li>
                    On the list, check cards then use bulk{" "}
                    <strong>Pin</strong>, <strong>Unpin</strong>,{" "}
                    <strong>Archive</strong>, or <strong>Restore</strong>
                  </li>
                  <li>Bulk actions stay in this tab only — not saved</li>
                </ul>
              </section>

              <section>
                <h3>Demo limits</h3>
                <ul>
                  <li>
                    Pin / archive use this-tab session storage; many other
                    toggles reset on refresh
                  </li>
                  <li>
                    No command palette, shared pipelines, or live sharing links
                  </li>
                  <li>
                    Reset does not change TypeScript seed files on disk
                  </li>
                  <li>
                    An empty list usually means filters or search — use Clear
                    filters, or Reset demo data after heavy testing
                  </li>
                  <li>
                    Import/export moves session overlays only — not seed files,
                    attachments, or on-screen toggles
                  </li>
                  <li>
                    Diagnostics are read-only warnings — they do not repair or
                    block a confirmed import
                  </li>
                </ul>
              </section>

              <section className="workspace-help__reset">
                <h3>Workspace diagnostics</h3>
                <p className="muted-note" style={{ margin: "0 0 0.65rem" }}>
                  Check the seed catalog and this tab’s session overlays for
                  orphan ids, invalid stages, weak intake stubs, and a few
                  other high-signal shape issues. Does not fix data.
                </p>
                <button
                  type="button"
                  className="doc-state-actions__btn"
                  onClick={handleRunDiagnostics}
                >
                  Run workspace diagnostics
                </button>
                {diagnosticIssues ? (
                  <div
                    className="workspace-help__diagnostics"
                    style={{ marginTop: "0.65rem" }}
                  >
                    {diagnosticIssues.length === 0 ? (
                      <p className="muted-note" style={{ margin: 0 }}>
                        No issues found in seed catalog or this tab’s session
                        overlays.
                      </p>
                    ) : (
                      <>
                        <p className="muted-note" style={{ margin: "0 0 0.35rem" }}>
                          {diagnosticIssues.length} issue
                          {diagnosticIssues.length === 1 ? "" : "s"} found
                          (read-only):
                        </p>
                        <ul>
                          {diagnosticIssues.map((issue, index) => (
                            <li key={`${issue.code}-${index}`}>
                              {issue.message}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ) : null}
              </section>

              <section className="workspace-help__reset">
                <h3>Import / export</h3>
                <p className="muted-note" style={{ margin: "0 0 0.65rem" }}>
                  Download this tab’s pins, archives, tags, intake stub, and
                  recents as JSON. Import replaces those overlays, then
                  reloads. Seed files and attachments are not included.
                </p>
                <div
                  className="doc-state-actions"
                  role="group"
                  aria-label="Workspace import and export"
                >
                  <button
                    type="button"
                    className="doc-state-actions__btn"
                    onClick={handleExportWorkspace}
                  >
                    Export workspace JSON
                  </button>
                  <button
                    type="button"
                    className="doc-state-actions__btn"
                    onClick={handleImportPick}
                  >
                    Import workspace JSON
                  </button>
                  <input
                    ref={importInputRef}
                    type="file"
                    accept="application/json,.json"
                    hidden
                    onChange={(event) => handleImportFile(event.target.files)}
                  />
                </div>
              </section>

              <section className="workspace-help__reset">
                <h3>Reset demo data</h3>
                <p className="muted-note" style={{ margin: "0 0 0.65rem" }}>
                  Restore this tab to the default seeded sample state after
                  testing. Clears session overlays and reloads the page.
                </p>
                <button
                  type="button"
                  className="doc-state-actions__btn"
                  onClick={handleResetDemoData}
                >
                  Reset demo data
                </button>
              </section>
            </div>

            <p className="muted-note workspace-help__footer">
              Press Esc to close · ? to open (when not in a field).
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
