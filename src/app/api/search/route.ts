import { NextResponse } from "next/server";
import { SearchService } from "@/server/services/search.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    
    const suggestions = await SearchService.getSuggestions(query);
    const popular = await SearchService.getPopularSearches();

    return NextResponse.json(
      {
        suggestions,
        popular,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
