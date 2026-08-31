import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import { WorkspaceHelp } from "@/components/WorkspaceHelp";
import { TRIAL_BUILD, showDemoWorkspaceChrome } from "@/lib/trial-build";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Condo Clear",
  description:
    "Structured condo screening for a small number of opportunities — not a CRM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={ibmPlexSans.variable} suppressHydrationWarning>
        <header className="site-header">
          <div className="site-header-inner">
            <Link href="/" className="site-brand">
              Condo Clear
            </Link>
            <nav className="site-nav" aria-label="Main">
              {TRIAL_BUILD ? null : <Link href="/">Home</Link>}
              <Link href="/properties">Properties</Link>
              {TRIAL_BUILD ? null : (
                <Link href="/intake">Stub generator</Link>
              )}
              {showDemoWorkspaceChrome() ? <WorkspaceHelp /> : null}
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
