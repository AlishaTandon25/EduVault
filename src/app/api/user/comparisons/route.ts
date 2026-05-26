import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comparisons = await prisma.savedComparison.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comparisons);
  } catch (error: any) {
    console.error("Comparisons GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, collegeSlugs } = await request.json();
    if (!name || !collegeSlugs || !Array.isArray(collegeSlugs)) {
      return NextResponse.json({ error: "name and collegeSlugs array are required" }, { status: 400 });
    }

    const comparison = await prisma.savedComparison.create({
      data: {
        userId: session.user.id,
        name,
        collegeSlugs,
      },
    });

    return NextResponse.json(comparison, { status: 201 });
  } catch (error: any) {
    console.error("Comparisons POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
