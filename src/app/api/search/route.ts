import { NextResponse } from "next/server";
import { SearchService } from "@/server/services/search.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    
    const suggestions = await SearchService.getSuggestions(query);
    const popular = await SearchService.getPopularSearches();

    return NextResponse.json({
      suggestions,
      popular,
    });
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
