import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page-stack">
      <section className="page-intro">
        <h1>Florida condo deal screening</h1>
        <p>
          A lightweight, file-based workspace for screening properties before
          deeper diligence. Structured facts live in TypeScript data files;
          original memos and notes stay available as reference.
        </p>
      </section>

      <section className="home-cta">
        <h2>Start here</h2>
        <p>
          Browse screened properties, open a detail page, and review snapshot,
          known vs missing items, taxes, association signals, and screen
          outcome.
        </p>
        <Link href="/properties" className="button-primary">
          View properties
        </Link>
      </section>
    </main>
  );
}
