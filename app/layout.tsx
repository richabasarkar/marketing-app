import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StrategyOS — AI Marketing Strategy Platform",
  description: "Build your complete marketing strategy with AI-powered insights, detailed plans, and an integrated project management tool.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="noise-bg">
        {children}
      </body>
    </html>
  );
}
