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

  function loadExample() {
    const stub = duplicatePropertyAsDemoStub(property);
    saveIntakeStubToSession(stub);
    router.push("/properties/intake-stub");
  }

  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <div
        className="doc-state-actions"
        role="group"
        aria-label="Example deal actions"
      >
        <button
          type="button"
          className="button-secondary"
          onClick={loadExample}
        >
          Load example deal
        </button>
      </div>
      <p className="muted-note" style={{ marginTop: "0.35rem" }}>
        Opens an <strong>Example data</strong> copy in this tab only — does not
        change the original deal or save anything permanently.
      </p>
    </div>
  );
}
