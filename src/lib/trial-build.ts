/**
 * Trial-build surface flag.
 *
 * Product stance: structured condo screening for a small number of
 * opportunities — not a CRM or collaboration platform.
 *
 * When true, the pilot experience is screening-first: Niagara is the seeded
 * deal, and extra workspace tools stay out of view. Flip to false for the
 * full internal demo workspace.
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
