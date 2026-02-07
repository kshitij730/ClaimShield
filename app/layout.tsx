import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClaimShield | AI Fraud Detection",
  description: "Multimodal Insurance Claim Fraud Detection & Reasoning Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
