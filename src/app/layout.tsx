import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import { WorkspaceHelp } from "@/components/WorkspaceHelp";
import { showDemoWorkspaceChrome } from "@/lib/trial-build";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Deal Screen",
  description:
    "Structured condo screening for a small number of opportunities — not a CRM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ibmPlexSans.variable}>
        <header className="site-header">
          <div className="site-header-inner">
            <Link href="/" className="site-brand">
              Deal Screen
            </Link>
            <nav className="site-nav">
              <Link href="/">Home</Link>
              <Link href="/properties">Properties</Link>
              <Link href="/intake">Stub generator</Link>
              {showDemoWorkspaceChrome() ? <WorkspaceHelp /> : null}
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
