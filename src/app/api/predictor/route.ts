import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function clampChance(value: number) {
  return Math.max(5, Math.min(95, Math.round(value)));
}

function classify(bucketScore: number) {
  if (bucketScore >= 0.7) return "dream";
  if (bucketScore >= 0.35) return "moderate";
  return "safe";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const exam = searchParams.get("exam");
    const rankStr = searchParams.get("rank");

    if (!exam || !rankStr) {
      return NextResponse.json({ error: "exam and rank are required parameters" }, { status: 400 });
    }

    const rank = Number(rankStr);
    if (isNaN(rank) || rank <= 0) {
      return NextResponse.json({ error: "rank must be a valid positive integer" }, { status: 400 });
    }

    const matches = await prisma.predictor.findMany({
      where: {
        exam: exam.toUpperCase(),
        minRank: { lte: rank * 1.25 },
        maxRank: { gte: Math.max(1, Math.floor(rank * 0.75)) },
      },
      include: {
        college: {
          include: {
            courses: { take: 2 },
          },
        },
      },
      orderBy: {
        minRank: "asc",
      },
    });

    const enriched = matches.map((match) => {
      const spread = Math.max(1, match.maxRank - match.minRank);
      const distanceFromBest = Math.max(0, rank - match.minRank) / spread;
      const chancePercentage = clampChance(100 - distanceFromBest * 90);
      const bucket = classify(distanceFromBest);

      return {
        ...match,
        openingCutoff: match.minRank,
        closingCutoff: match.maxRank,
        chancePercentage,
        bucket,
      };
    });

    const grouped = {
      dream: enriched.filter((item) => item.bucket === "dream").slice(0, 12),
      moderate: enriched.filter((item) => item.bucket === "moderate").slice(0, 12),
      safe: enriched.filter((item) => item.bucket === "safe").slice(0, 12),
    };

    return NextResponse.json({
      exam: exam.toUpperCase(),
      rank,
      ...grouped,
      all: enriched.slice(0, 40),
    });
  } catch (error: any) {
    console.error("Predictor API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
