"use client";

import { useRouter } from "next/navigation";
import type { PropertyScreen } from "@/types/property";
import {
  duplicatePropertyAsDemoStub,
  saveIntakeStubToSession,
} from "@/lib/intake-property-stub";

type DuplicateDemoStubButtonProps = {
  property: PropertyScreen;
};

export function DuplicateDemoStubButton({
  property,
}: DuplicateDemoStubButtonProps) {
  const router = useRouter();

  function duplicate() {
    const stub = duplicatePropertyAsDemoStub(property);
    saveIntakeStubToSession(stub);
    router.push("/properties/intake-stub");
  }

  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <div
        className="doc-state-actions"
        role="group"
        aria-label="Demo duplicate actions"
      >
        <button
          type="button"
          className="doc-state-actions__btn"
          onClick={duplicate}
        >
          Duplicate as demo stub
        </button>
      </div>
      <p className="muted-note" style={{ marginTop: "0.35rem" }}>
        Opens a Sample copy in this tab only — does not change the original or
        save to the repo.
      </p>
    </div>
  );
}
