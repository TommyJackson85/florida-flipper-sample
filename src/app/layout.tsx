import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Deal Screen",
  description: "Lightweight property deal screening for Florida condo diligence.",
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
              <Link href="/intake">Intake</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
