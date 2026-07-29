/**
 * Trial-build surface flag.
 *
 * Product stance: a structured condo screening workspace for a small number of
 * opportunities — not a full CRM or collaboration platform.
 *
 * When true, demo CRM chrome stays in the codebase but is not mounted so the
 * screening deal path leads for pilots. Flip to false to restore the full
 * demo workspace shell.
 */
export const TRIAL_BUILD = true;

/** Workspace ops shell: overview, board, presets, bulk, pins, Help tools, etc. */
export function showDemoWorkspaceChrome(): boolean {
  return !TRIAL_BUILD;
}

/** Deal-screen toys that imply persistence/sharing beyond seed files. */
export function showDemoDealExtras(): boolean {
  return !TRIAL_BUILD;
}

/** Client status / print preview route — hidden from pilot build. */
export function showClientStatusPreview(): boolean {
  return !TRIAL_BUILD;
}
