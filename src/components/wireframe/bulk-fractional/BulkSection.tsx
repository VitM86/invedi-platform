// Bulk landing — composition of part 2 sub-components.
//
// Sub-components live alongside this file so part 3 (real filter wiring) can swap
// BulkFilterBar without touching the rest of the layout, and a later real-data pass can
// replace bulkMockData without touching presentation. Section spacing rhythm: large gaps
// between bands so the page reads as distinct content blocks rather than a wall.

import { BulkIntroBanner } from "./BulkIntroBanner";
import { BulkStatsRow } from "./BulkStatsRow";
import { BulkFilterBar } from "./BulkFilterBar";
import { BulkMarketsGrid } from "./BulkMarketsGrid";

export function BulkSection() {
  return (
    <div className="space-y-10 lg:space-y-14">
      <BulkIntroBanner />
      <BulkStatsRow />
      <BulkFilterBar />
      <BulkMarketsGrid />
    </div>
  );
}
