import { NextResponse } from "next/server";
import { runDatabaseSeed } from "@/server/seed/run-database-seed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const secret = process.env.SEED_ADMIN_KEY;
  if (!secret) return false;

  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const seedKeyHeader = request.headers.get("x-seed-key");

  return bearer === secret || seedKeyHeader === secret;
}

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const clearExisting = body?.clearExisting !== false;
    const targetCount = Number(body?.targetCount) > 0 ? Number(body.targetCount) : 1000;
    const includeReviews = body?.includeReviews === true;

    const result = await runDatabaseSeed({
      clearExisting,
      targetCount,
      includeReviews,
    });

    return NextResponse.json({
      ok: true,
      message: "Seed completed",
      result,
    });
  } catch (error: any) {
    console.error("Admin seed error:", error);
    return NextResponse.json(
      { error: "Seed failed", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

