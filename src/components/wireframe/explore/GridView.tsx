"use client";

/**
 * GridView — responsive grid of project cards. Same filtered set as the Map view.
 */

import type { Project } from "@/lib/mock-data";
import { ProjectCard } from "../ProjectCard";

export function GridView({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((p) => (
        // showScore: explore surfaces the Invedi star badge, same as /v3.
        <ProjectCard key={p.slug} project={p} showScore />
      ))}
    </div>
  );
}
