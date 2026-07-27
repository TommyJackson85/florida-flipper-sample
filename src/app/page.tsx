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
          Browse screened properties, review Florida condo risk flags, or
          generate a stub for the next address.
        </p>
        <div className="home-cta__actions">
          <Link href="/properties" className="button-primary">
            View properties
          </Link>
          <Link href="/intake" className="button-secondary">
            New property intake
          </Link>
        </div>
      </section>
    </main>
  );
}
