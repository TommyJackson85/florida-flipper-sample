type TrialPilotIntroProps = {
  address: string;
};

/**
 * Pilot orientation banner for trial deal screens.
 */
export function TrialPilotIntro({ address }: TrialPilotIntroProps) {
  return (
    <aside className="trial-pilot-intro" aria-labelledby="trial-pilot-intro-heading">
      <h2 id="trial-pilot-intro-heading" className="trial-pilot-intro__heading">
        Pilot sample deal and feedback
      </h2>
      <p className="trial-pilot-intro__body">
        This page shows a fixed sample dataset for {address} in Tampa — compiled
        from public records and listing sources for pilot review, not live MLS or
        association data. Scroll the full screening report below, then use the
        short questionnaire at the bottom (~45 seconds) to tell us whether this
        format would help on a real condo deal. Responses go to the Condo Clear
        Google Form; this app does not store answers. Preliminary screening only
        — not legal, engineering, insurance, or investment advice.
      </p>
    </aside>
  );
}
