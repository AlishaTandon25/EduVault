import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const colleges = await prisma.college.findMany();

  return NextResponse.json({
    success: true,
    colleges,
  });
}
