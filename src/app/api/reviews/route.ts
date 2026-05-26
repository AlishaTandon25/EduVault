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

    const { rating, title, comment, collegeId } = await request.json();
    if (!rating || !title || !comment || !collegeId) {
      return NextResponse.json({ error: "rating, title, comment, and collegeId are required" }, { status: 400 });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ error: "rating must be a number between 1 and 5" }, { status: 400 });
    }

    // Check if user already reviewed this college
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        collegeId,
      },
    });

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this college" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        rating: numericRating,
        title,
        comment,
        userId: session.user.id,
        collegeId,
      },
    });

    // Recalculate college average rating
    const allReviews = await prisma.review.findMany({
      where: { collegeId },
      select: { rating: true },
    });

    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.college.update({
      where: { id: collegeId },
      data: {
        rating: parseFloat(averageRating.toFixed(1)),
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error("Review submit error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
