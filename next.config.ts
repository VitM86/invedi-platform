import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The old landing (/) and /v2 were removed and /v3 was promoted to the root. Redirect the old
  // version URLs to the homepage so previously-shared links (screenshots, founder messages) never
  // 404. 308 = permanent (cached), method-preserving.
  async redirects() {
    return [
      { source: "/v3", destination: "/", permanent: true },
      { source: "/v2", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
