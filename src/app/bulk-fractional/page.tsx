import type { Metadata } from "next";
import { BulkFractionalView } from "@/components/wireframe/bulk-fractional/BulkFractionalView";
import { parseBfView } from "@/components/wireframe/bulk-fractional/types";

export const metadata: Metadata = {
  title: "Bulk & fractional — Invedi",
  description:
    "Two ways for groups to enter Invedi inventory — bulk discounts on multi-unit reservations or fractional ownership of single units.",
};

// /bulk-fractional — shell route. Server reads `?view=` and hands the resolved sub-section
// to the client orchestrator (BulkFractionalView). The two sub-sections (BulkSection,
// FractionalSection) are placeholders today; part 2 and part 4 fill them in. Default is
// Bulk; `?view=fractional` deep-links to the Fractional tab.
export default async function BulkFractionalPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  return <BulkFractionalView initialView={parseBfView(view)} />;
}
