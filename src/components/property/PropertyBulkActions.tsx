type PropertyBulkActionsProps = {
  selectedCount: number;
  canArchive: boolean;
  canRestore: boolean;
  onPin: () => void;
  onUnpin: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onSelectAllVisible: () => void;
  onClear: () => void;
  allVisibleSelected: boolean;
};

export function PropertyBulkActions({
  selectedCount,
  canArchive,
  canRestore,
  onPin,
  onUnpin,
  onArchive,
  onRestore,
  onSelectAllVisible,
  onClear,
  allVisibleSelected,
}: PropertyBulkActionsProps) {
  if (selectedCount === 0) {
    return (
      <section className="page-intro" style={{ marginBottom: 0, marginTop: 0 }}>
        <p className="muted-note">Bulk actions</p>
        <p className="muted-note" style={{ marginTop: "0.25rem" }}>
          Select list cards to pin, unpin, archive, or restore (this tab only).
        </p>
        <div
          className="doc-state-actions"
          style={{ marginTop: "0.5rem" }}
          role="group"
          aria-label="Bulk selection helpers"
        >
          <button
            type="button"
            className="doc-state-actions__btn"
            onClick={onSelectAllVisible}
          >
            Select all visible
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page-intro" style={{ marginBottom: 0, marginTop: 0 }}>
      <p className="muted-note">
        Bulk actions · {selectedCount} selected (this tab only — not saved).
      </p>
      <div
        className="doc-state-actions"
        style={{ marginTop: "0.5rem" }}
        role="group"
        aria-label="Bulk actions"
      >
        <button
          type="button"
          className={
            allVisibleSelected
              ? "doc-state-actions__btn doc-state-actions__btn--active"
              : "doc-state-actions__btn"
          }
          onClick={onSelectAllVisible}
        >
          Select all visible
        </button>
        <button
          type="button"
          className="doc-state-actions__btn"
          onClick={onClear}
        >
          Clear
        </button>
        <button type="button" className="doc-state-actions__btn" onClick={onPin}>
          Pin
        </button>
        <button
          type="button"
          className="doc-state-actions__btn"
          onClick={onUnpin}
        >
          Unpin
        </button>
        {canArchive ? (
          <button
            type="button"
            className="doc-state-actions__btn"
            onClick={onArchive}
          >
            Archive
          </button>
        ) : null}
        {canRestore ? (
          <button
            type="button"
            className="doc-state-actions__btn"
            onClick={onRestore}
          >
            Restore
          </button>
        ) : null}
      </div>
    </section>
  );
}
