/** Which sub-section of /bulk-fractional is showing. */
export type BfView = "bulk" | "fractional";

/** Server-side fallback: anything other than the two known values lands on Bulk. */
export function parseBfView(raw: string | undefined): BfView {
  return raw === "fractional" ? "fractional" : "bulk";
}
