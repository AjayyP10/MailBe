import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "MailBe - AI-Powered Email Client",
  description: "Privacy-first, open-source AI email assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
