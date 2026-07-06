import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fraunces } from "next/font/google";
import { getProject, projects } from "@/lib/mock-data";
import { StoryTemplate } from "@/components/wireframe/story/StoryTemplate";

// Editorial serif — scoped to this route via `fraunces.variable` on the root div (same pattern as
// /v2 and /v3). Applied by headings through `style={{ fontFamily: "var(--font-serif)" }}`.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal"],
  variable: "--font-serif",
  display: "swap",
});

// Only projects with a filled `story` get a story page. A fourth story = data only, no route change.
export function generateStaticParams() {
  return projects.filter((p) => p.story).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.story) return { title: "Story — Invedi" };
  return {
    title: `${project.name} — Invedi`,
    description: project.story.intro,
    // Prototype editorial (placeholder content) — keep it out of search for now, like /v2 and /v3.
    robots: { index: false, follow: false },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !project.story) notFound();

  return (
    <div className={`${fraunces.variable} min-h-screen bg-white`}>
      <StoryTemplate project={project} />
    </div>
  );
}
