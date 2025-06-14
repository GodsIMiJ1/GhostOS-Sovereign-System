import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "writeOS-scribe-terminal",
  description: "Sovereign scroll editor + AI assistant app",
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
