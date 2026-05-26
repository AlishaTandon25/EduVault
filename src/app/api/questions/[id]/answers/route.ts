import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const questionId = resolvedParams.id;

    if (!questionId) {
      return NextResponse.json({ error: "Question ID is required" }, { status: 400 });
    }

    const { answer } = await request.json();
    if (!answer) {
      return NextResponse.json({ error: "answer is required" }, { status: 400 });
    }

    const newAnswer = await prisma.answer.create({
      data: {
        answer,
        userId: session.user.id,
        questionId,
      },
    });

    return NextResponse.json(newAnswer, { status: 201 });
  } catch (error: any) {
    console.error("Answer submit error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
