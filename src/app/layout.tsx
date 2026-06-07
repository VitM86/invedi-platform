import type { Metadata } from "next";
import "./globals.css";
import { UnlockProvider } from "@/components/wireframe/UnlockProvider";

export const metadata: Metadata = {
  title: "Invedi — new-build real estate marketplace",
  description: "Browse verified new-build developments across Europe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <UnlockProvider>{children}</UnlockProvider>
      </body>
    </html>
  );
}
