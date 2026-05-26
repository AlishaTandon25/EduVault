import { NextResponse } from "next/server";
import { UsersRepository } from "@/server/db/users.repository";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const savedColleges = await UsersRepository.getSavedColleges(session.user.id);
    const activities = await UsersRepository.getRecentActivity(session.user.id);
    const comparisons = await prisma.savedComparison.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      user: {
        name: session.user.name,
        email: session.user.email,
      },
      savedColleges,
      activities,
      comparisons,
    });
  } catch (error: any) {
    console.error("Dashboard data GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
