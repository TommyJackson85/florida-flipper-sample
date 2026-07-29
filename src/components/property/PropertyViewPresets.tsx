type ViewPresetId =
  | "all-active"
  | "needs-attention"
  | "dates-due"
  | "post-close"
  | "pinned";

type PropertyViewPresetsProps = {
  activePreset: ViewPresetId | null;
  onSelect: (preset: ViewPresetId) => void;
};

const PRESETS: { id: ViewPresetId; label: string }[] = [
  { id: "all-active", label: "All active" },
  { id: "needs-attention", label: "Needs attention" },
  { id: "dates-due", label: "Dates due" },
  { id: "post-close", label: "Post-close" },
  { id: "pinned", label: "Pinned" },
];

export type { ViewPresetId };

export function PropertyViewPresets({
  activePreset,
  onSelect,
}: PropertyViewPresetsProps) {
  return (
    <section className="page-intro" style={{ marginBottom: 0, marginTop: 0 }}>
      <p className="muted-note">View presets</p>
      <p className="muted-note" style={{ marginTop: "0.25rem" }}>
        Built-in slices only — reset on refresh. Not saved views.
      </p>
      <div
        className="doc-state-actions"
        style={{ marginTop: "0.5rem" }}
        role="group"
        aria-label="View presets"
      >
        {PRESETS.map((preset) => {
          const pressed = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              className={
                pressed
                  ? "doc-state-actions__btn doc-state-actions__btn--active"
                  : "doc-state-actions__btn"
              }
              aria-pressed={pressed}
              onClick={() => onSelect(preset.id)}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
