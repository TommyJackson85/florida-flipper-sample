import Link from "next/link";

type WorkspaceQuickActionsProps = {
  viewMode: "list" | "board";
  pinFilterActive: boolean;
  showArchived: boolean;
  archivedCount: number;
  needsAttentionHref?: string | null;
  onShowBoard: () => void;
  onShowPinned: () => void;
  onToggleArchived: () => void;
};

export function WorkspaceQuickActions({
  viewMode,
  pinFilterActive,
  showArchived,
  archivedCount,
  needsAttentionHref,
  onShowBoard,
  onShowPinned,
  onToggleArchived,
}: WorkspaceQuickActionsProps) {
  return (
    <section className="page-intro" style={{ marginBottom: 0, marginTop: 0 }}>
      <p className="muted-note">Quick actions</p>
      <p className="muted-note" style={{ marginTop: "0.25rem" }}>
        Jumps to existing flows — not a command palette.
      </p>
      <div
        className="doc-state-actions"
        style={{ marginTop: "0.5rem" }}
        role="group"
        aria-label="Workspace quick actions"
      >
        <Link href="/intake" className="doc-state-actions__btn">
          New intake
        </Link>
        <button
          type="button"
          className={
            viewMode === "board"
              ? "doc-state-actions__btn doc-state-actions__btn--active"
              : "doc-state-actions__btn"
          }
          aria-pressed={viewMode === "board"}
          onClick={onShowBoard}
        >
          Board
        </button>
        <button
          type="button"
          className={
            pinFilterActive
              ? "doc-state-actions__btn doc-state-actions__btn--active"
              : "doc-state-actions__btn"
          }
          aria-pressed={pinFilterActive}
          onClick={onShowPinned}
        >
          Pinned
        </button>
        {archivedCount > 0 ? (
          <button
            type="button"
            className={
              showArchived
                ? "doc-state-actions__btn doc-state-actions__btn--active"
                : "doc-state-actions__btn"
            }
            aria-pressed={showArchived}
            onClick={onToggleArchived}
          >
            {showArchived ? "Hide archived" : "Show archived"}
          </button>
        ) : null}
        {needsAttentionHref ? (
          <Link href={needsAttentionHref} className="doc-state-actions__btn">
            Needs attention
          </Link>
        ) : null}
      </div>
    </section>
  );
}
