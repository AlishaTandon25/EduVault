import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question, collegeId } = await request.json();
    if (!question || !collegeId) {
      return NextResponse.json({ error: "question and collegeId are required" }, { status: 400 });
    }

    const newQuestion = await prisma.question.create({
      data: {
        question,
        userId: session.user.id,
        collegeId,
      },
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error: any) {
    console.error("Question submit error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
