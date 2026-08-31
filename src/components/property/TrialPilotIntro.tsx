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
        Review this sample condo screening report for {address}, Tampa. It uses
        public records and listing data for pilot testing only—not live MLS or
        association data.
      </p>
      <p className="trial-pilot-intro__body">
        Then complete the 45-second questionnaire below. Your feedback helps us
        improve Condo Clear for real deals.
      </p>
      <p className="trial-pilot-intro__body">
        Preliminary screening only—not legal, engineering, insurance, or
        investment advice.
      </p>
    </aside>
  );
}
