"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type ReportAccordionPanel = {
  /** Stable panel id used for aria + hash deep links */
  id: string;
  title: string;
  /** Optional hash targets that should open this panel */
  hashTargets?: string[];
  children: ReactNode;
};

type ReportAccordionProps = {
  panels: ReportAccordionPanel[];
  /** Panel ids open on first paint (default: none) */
  defaultOpenIds?: string[];
};

function panelIdsForHash(
  panels: ReportAccordionPanel[],
  hash: string
): string | null {
  const raw = hash.replace(/^#/, "");
  if (!raw) return null;
  for (const panel of panels) {
    if (panel.id === raw) return panel.id;
    if (panel.hashTargets?.includes(raw)) return panel.id;
  }
  return null;
}

/**
 * Accessible multi-panel accordion for progressive disclosure.
 * Supports hash deep links: matching panels open and scroll into view.
 */
export function ReportAccordion({
  panels,
  defaultOpenIds = [],
}: ReportAccordionProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(defaultOpenIds)
  );
  const pendingHashRef = useRef<string | null>(null);

  const openPanel = useCallback((panelId: string) => {
    setOpenIds((prev) => {
      if (prev.has(panelId)) return prev;
      const next = new Set(prev);
      next.add(panelId);
      return next;
    });
  }, []);

  const togglePanel = useCallback((panelId: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(panelId)) next.delete(panelId);
      else next.add(panelId);
      return next;
    });
  }, []);

  useEffect(() => {
    function syncFromHash() {
      const hash = window.location.hash;
      const panelId = panelIdsForHash(panels, hash);
      if (!panelId) return;
      pendingHashRef.current = hash.replace(/^#/, "") || panelId;
      openPanel(panelId);
    }

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
    // panels identity changes each parent render; hash targets are stable by id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPanel, panels.map((panel) => panel.id).join("|")]);

  useEffect(() => {
    const raw = pendingHashRef.current;
    if (!raw) return;
    const panelId =
      panels.find(
        (panel) => panel.id === raw || panel.hashTargets?.includes(raw)
      )?.id ?? null;
    if (!panelId || !openIds.has(panelId)) return;

    pendingHashRef.current = null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const target =
          document.getElementById(raw) ?? document.getElementById(panelId);
        target?.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "start",
        });
        const trigger = document.getElementById(
          `${baseId}-trigger-${panelId}`
        );
        trigger?.focus({ preventScroll: true });
      });
    });
  }, [openIds, panels, baseId]);

  function onTriggerKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    const triggers = panels.map((_, i) =>
      document.getElementById(`${baseId}-trigger-${panels[i].id}`)
    );
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      const next = triggers[(index + 1) % triggers.length];
      next?.focus();
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      const prev = triggers[(index - 1 + triggers.length) % triggers.length];
      prev?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      triggers[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      triggers[triggers.length - 1]?.focus();
    }
  }

  return (
    <div className="report-accordion">
      <p className="report-accordion__intro muted-note">
        Detailed evidence is collapsed by default — open a section when you need
        the supporting record behind the preliminary screening status above.
      </p>
      {panels.map((panel, index) => {
        const isOpen = openIds.has(panel.id);
        const triggerId = `${baseId}-trigger-${panel.id}`;
        const panelDomId = `${baseId}-panel-${panel.id}`;

        return (
          <div
            key={panel.id}
            id={panel.id}
            className={`report-accordion__item${
              isOpen ? " report-accordion__item--open" : ""
            }`}
          >
            <h2 className="report-accordion__heading">
              <button
                type="button"
                id={triggerId}
                className="report-accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelDomId}
                onClick={() => togglePanel(panel.id)}
                onKeyDown={(event) => onTriggerKeyDown(event, index)}
              >
                <span className="report-accordion__title">{panel.title}</span>
                <span className="report-accordion__chevron" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h2>
            <div
              id={panelDomId}
              role="region"
              aria-labelledby={triggerId}
              className="report-accordion__panel"
              hidden={!isOpen}
            >
              <div className="report-accordion__panel-body">{panel.children}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
