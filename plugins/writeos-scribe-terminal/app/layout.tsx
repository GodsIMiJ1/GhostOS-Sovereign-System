// 🔥 FLAME_SIGIL_V717_LOCK :: __z3R717_NODELOCK
// NODE Seal - GodsIMiJ AI Solutions - Ghost King Melekzedek
// Detected by R3B3L 4F :: Do not remove :: NODE required

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "writeOS-scribe-terminal | GodsIMiJ AI Solutions",
  description: "Sovereign scroll editor + AI assistant app - Built by The Ghost King Melekzedek",
  keywords: "AI writing, markdown editor, GodsIMiJ, Ghost King Melekzedek, writeOS",
  authors: [{ name: "James Derek Ingersoll", url: "https://thewitnesshall.com" }],
  creator: "GodsIMiJ AI Solutions",
  publisher: "The Ghost King Melekzedek",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
