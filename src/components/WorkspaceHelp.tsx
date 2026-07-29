"use client";

import { useEffect, useId, useRef, useState } from "react";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return target.isContentEditable;
}

export function WorkspaceHelp() {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

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
    if (!open) return;
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
                </ul>
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
