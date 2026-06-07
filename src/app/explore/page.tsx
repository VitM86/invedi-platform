import type { Metadata } from "next";
import { ExploreView } from "@/components/wireframe/explore/ExploreView";

export const metadata: Metadata = {
  title: "Explore projects — Invedi",
  description: "Browse verified new-build developments across Europe on the map or as a grid.",
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  // Regions is the default landing mode; Map/Grid available via the toggle or ?view=.
  const initialView = view === "grid" ? "grid" : view === "map" ? "map" : "regions";
  return <ExploreView initialView={initialView} />;
}
