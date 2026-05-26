import { prisma } from "@/lib/prisma";

export const UsersRepository = {
  async getSavedColleges(userId: string) {
    return prisma.savedCollege.findMany({
      where: { userId },
      include: {
        college: {
          include: {
            courses: { take: 2 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async isSaved(userId: string, collegeId: string) {
    const saved = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: { userId, collegeId },
      },
    });
    return !!saved;
  },

  async saveCollege(userId: string, collegeId: string) {
    return prisma.savedCollege.create({
      data: { userId, collegeId },
    });
  },

  async unsaveCollege(userId: string, collegeId: string) {
    return prisma.savedCollege.delete({
      where: {
        userId_collegeId: { userId, collegeId },
      },
    });
  },

  async getRecentActivity(userId: string) {
    return prisma.recentActivity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  },

  async logActivity(userId: string, type: any, targetId: string, targetName: string) {
    return prisma.recentActivity.create({
      data: {
        userId,
        type,
        targetId,
        targetName,
      },
    });
  },
};
