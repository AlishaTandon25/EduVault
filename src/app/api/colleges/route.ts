import { NextResponse } from "next/server";
import { CollegesRepository } from "@/server/db/colleges.repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || undefined;
    const state = searchParams.get("state") || undefined;
    const city = searchParams.get("city") || undefined;
    const stream = searchParams.get("stream") || undefined;
    const ownership = searchParams.get("ownership") || undefined;
    const minFees = searchParams.get("minFees") ? Number(searchParams.get("minFees")) : undefined;
    const maxFees = searchParams.get("maxFees") ? Number(searchParams.get("maxFees")) : undefined;
    const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined;
    const naacGrade = searchParams.get("naacGrade") || undefined;

    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 10;
    const sort = searchParams.get("sort") || undefined;

    const filters = {
      search,
      state,
      city,
      stream,
      ownership,
      minFees,
      maxFees,
      minRating,
      naacGrade,
    };

    const result = await CollegesRepository.findAll(filters, { page, limit }, sort);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error: any) {
    console.error("Colleges GET error:", error);
    const debug = process.env.DEBUG_API_ERRORS === "true";
    return NextResponse.json(
      {
        error: "Internal Server Error",
        ...(debug
          ? {
              details: error?.message || "Unknown error",
              code: error?.code || null,
              name: error?.name || null,
            }
          : {}),
      },
      { status: 500 }
    );
  }
}
