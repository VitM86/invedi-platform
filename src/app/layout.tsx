import type { Metadata } from "next";
import "./globals.css";
import { UnlockProvider } from "@/components/wireframe/UnlockProvider";
import { ReserveProvider } from "@/components/wireframe/reserve/ReserveProvider";
import { ReserveSheet } from "@/components/wireframe/reserve/ReserveSheet";

export const metadata: Metadata = {
  title: "Invedi — new-build real estate marketplace",
  description: "Browse verified new-build developments across Europe.",
};

// Reserve flow lives at the root so any page (unit detail, project unit list, future flows)
// can trigger it via `useReserve()` and the ReserveSheet renders ONCE on top of everything.
// Sheet visibility is driven by the provider's `target` state, NOT by a per-page mount.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <UnlockProvider>
          <ReserveProvider>
            {children}
            <ReserveSheet />
          </ReserveProvider>
        </UnlockProvider>
      </body>
    </html>
  );
}
