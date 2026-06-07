"use client";

/**
 * SalesSheetProvider — provides one shared SalesSheet to a page so multiple triggers (hero
 * CTAs, advisor card, etc.) open the same panel. Wrap server-rendered page content with it;
 * trigger buttons call useSalesSheet().open(intent).
 */

import { createContext, useContext, useState } from "react";
import { SalesSheet, type SalesIntent } from "./SalesSheet";

const SalesSheetContext = createContext<{ open: (intent: SalesIntent) => void } | null>(null);

export function useSalesSheet() {
  const ctx = useContext(SalesSheetContext);
  if (!ctx) throw new Error("useSalesSheet must be used within a SalesSheetProvider");
  return ctx;
}

export function SalesSheetProvider({
  context,
  children,
}: {
  context: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<SalesIntent>("advisor");

  return (
    <SalesSheetContext.Provider
      value={{
        open: (i) => {
          setIntent(i);
          setOpen(true);
        },
      }}
    >
      {children}
      {open && (
        <SalesSheet
          intent={intent}
          onIntentChange={setIntent}
          onClose={() => setOpen(false)}
          context={context}
        />
      )}
    </SalesSheetContext.Provider>
  );
}
