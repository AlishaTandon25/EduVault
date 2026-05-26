import { NextResponse } from "next/server";
import { CollegesRepository } from "@/server/db/colleges.repository";
import { UsersRepository } from "@/server/db/users.repository";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const college = await CollegesRepository.findBySlug(slug);

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    // Optional: Log activity if user is authenticated
    const session = await getServerSession(authOptions);
    let isSaved = false;

    if (session?.user?.id) {
      isSaved = await UsersRepository.isSaved(session.user.id, college.id);
      await UsersRepository.logActivity(
        session.user.id,
        "VIEW_COLLEGE",
        college.slug,
        college.name
      );
    }

    return NextResponse.json({
      ...college,
      isSaved,
    });
  } catch (error: any) {
    console.error("College detail GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
