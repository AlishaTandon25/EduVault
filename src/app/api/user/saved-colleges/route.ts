import { NextResponse } from "next/server";
import { UsersRepository } from "@/server/db/users.repository";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saved = await UsersRepository.getSavedColleges(session.user.id);
    return NextResponse.json(saved);
  } catch (error: any) {
    console.error("Saved colleges GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { collegeId } = await request.json();
    if (!collegeId) {
      return NextResponse.json({ error: "collegeId is required" }, { status: 400 });
    }

    const alreadySaved = await UsersRepository.isSaved(session.user.id, collegeId);
    if (alreadySaved) {
      return NextResponse.json({ message: "Already saved" });
    }

    const saved = await UsersRepository.saveCollege(session.user.id, collegeId);
    
    // Log activity
    await UsersRepository.logActivity(
      session.user.id,
      "SAVE_COLLEGE",
      collegeId,
      "Saved College"
    );

    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    console.error("Saved colleges POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const collegeId = searchParams.get("collegeId");

    if (!collegeId) {
      return NextResponse.json({ error: "collegeId is required" }, { status: 400 });
    }

    await UsersRepository.unsaveCollege(session.user.id, collegeId);
    return NextResponse.json({ message: "College unsaved successfully" });
  } catch (error: any) {
    console.error("Saved colleges DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
