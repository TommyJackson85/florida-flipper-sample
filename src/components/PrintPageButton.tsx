"use client";

type PrintPageButtonProps = {
  label?: string;
};

export function PrintPageButton({
  label = "Print / Save as PDF",
}: PrintPageButtonProps) {
  return (
    <button
      type="button"
      className="doc-state-actions__btn print-hide"
      onClick={() => window.print()}
    >
      {label}
    </button>
  );
}
