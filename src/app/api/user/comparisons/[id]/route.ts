import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const comparisonId = resolvedParams.id;

    if (!comparisonId) {
      return NextResponse.json({ error: "Comparison ID is required" }, { status: 400 });
    }

    const comparison = await prisma.savedComparison.findUnique({
      where: { id: comparisonId },
    });

    if (!comparison || comparison.userId !== session.user.id) {
      return NextResponse.json({ error: "Comparison not found or unauthorized" }, { status: 404 });
    }

    await prisma.savedComparison.delete({
      where: { id: comparisonId },
    });

    return NextResponse.json({ message: "Comparison set deleted successfully" });
  } catch (error: any) {
    console.error("Comparison delete error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
