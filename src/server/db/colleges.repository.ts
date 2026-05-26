import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface CollegeFilters {
  search?: string;
  state?: string;
  city?: string;
  stream?: string;
  ownership?: string;
  minFees?: number;
  maxFees?: number;
  minRating?: number;
  naacGrade?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export const CollegesRepository = {
  async findAll(filters: CollegeFilters = {}, pagination: PaginationOptions = {}, sort?: string) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.CollegeWhereInput = {};

    // Apply filters
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { city: { contains: filters.search, mode: "insensitive" } },
        { state: { contains: filters.search, mode: "insensitive" } },
        { shortDescription: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.state && filters.state !== "all") {
      where.state = { equals: filters.state, mode: "insensitive" };
    }

    if (filters.city && filters.city !== "all") {
      where.city = { equals: filters.city, mode: "insensitive" };
    }

    if (filters.stream && filters.stream !== "all") {
      where.stream = filters.stream.toUpperCase() as any;
    }

    if (filters.ownership && filters.ownership !== "all") {
      where.ownership = filters.ownership.toUpperCase() as any;
    }

    if (filters.minFees !== undefined || filters.maxFees !== undefined) {
      where.fees = {};
      if (filters.minFees !== undefined) where.fees.gte = filters.minFees;
      if (filters.maxFees !== undefined) where.fees.lte = filters.maxFees;
    }

    if (filters.minRating !== undefined) {
      where.rating = { gte: filters.minRating };
    }

    if (filters.naacGrade && filters.naacGrade !== "all") {
      where.naacGrade = filters.naacGrade;
    }

    // Determine sorting
    let orderBy: Prisma.CollegeOrderByWithRelationInput = { nirfRank: "asc" }; // Default sorting by NIRF
    if (sort) {
      const [field, order] = sort.split(":");
      if (field === "fees") orderBy = { fees: order as Prisma.SortOrder };
      else if (field === "rating") orderBy = { rating: order as Prisma.SortOrder };
      else if (field === "nirfRank") orderBy = { nirfRank: order as Prisma.SortOrder };
      else if (field === "establishedYear") orderBy = { establishedYear: order as Prisma.SortOrder };
    }

    // Execute queries
    const [data, total] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          courses: { take: 3 }, // Include first few courses
        },
      }),
      prisma.college.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async findBySlug(slug: string) {
    const college = await prisma.college.findUnique({
      where: { slug },
      include: {
        courses: true,
      },
    });

    if (!college) return null;

    const [reviews, questions] = await Promise.all([
      prisma.review.findMany({
        where: { collegeId: college.id },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.question.findMany({
        where: { collegeId: college.id },
        include: {
          user: { select: { id: true, name: true } },
          answers: {
            include: {
              user: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "asc" },
            take: 10,
          },
        },
        orderBy: { createdAt: "desc" },
        take: 15,
      }),
    ]);

    return {
      ...college,
      reviews,
      questions,
    };
  },

  async getSearchSuggestions(query: string) {
    if (!query) return [];

    const direct = await prisma.college.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          { state: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        slug: true,
        name: true,
        city: true,
        state: true,
        stream: true,
      },
      take: 8,
    });

    if (direct.length >= 5) return direct;

    const fuzzy = await prisma.college.findMany({
      where: {
        name: { startsWith: query[0], mode: "insensitive" },
      },
      select: {
        slug: true,
        name: true,
        city: true,
        state: true,
        stream: true,
      },
      take: 10,
    });

    const seen = new Set(direct.map((item) => item.slug));
    const merged = [...direct];
    for (const item of fuzzy) {
      if (!seen.has(item.slug)) merged.push(item);
      if (merged.length >= 8) break;
    }
    return merged;
  },
};
