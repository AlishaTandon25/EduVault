"use client";

import Link from "next/link";
import { useCompareStore } from "@/store/use-compare-store";

export default function CompareTable() {
  const { comparedColleges, removeFromCompare } = useCompareStore();

  if (!comparedColleges.length) {
    return (
      <div className="rounded-xl border border-dashed border-outline-variant p-6 text-center text-on-surface-variant">
        No colleges selected. <Link href="/colleges" className="text-primary underline">Add colleges</Link> to compare.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-outline-variant">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-outline-variant bg-surface-container-low">
            <th className="p-3 text-left">Metric</th>
            {comparedColleges.map((c) => (
              <th key={c.slug} className="p-3 text-left">
                <div className="flex items-center justify-between gap-3">
                  <span>{c.name}</span>
                  <button onClick={() => removeFromCompare(c.slug)} className="text-xs text-red-500">Remove</button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ["Location", (c: any) => c.location],
            ["Rating", (c: any) => c.rating],
            ["Avg Fees", (c: any) => c.avgFee],
            ["Avg Package", (c: any) => c.placement],
            ["NAAC", (c: any) => c.naac || "N/A"],
            ["NIRF", (c: any) => c.nirf || "N/A"],
          ].map((item, index) => {
            const metric = item[0] as string;
            const picker = item[1] as (c: any) => string | number;
            return (
            <tr key={metric as string} className="border-b border-outline-variant/40">
              <td className="p-3 font-semibold">{metric}</td>
              {comparedColleges.map((c) => (
                <td key={`${c.slug}-${metric as string}`} className="p-3">{(picker as any)(c)}</td>
              ))}
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
