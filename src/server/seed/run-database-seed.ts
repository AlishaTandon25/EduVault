import { hashSync } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { colleges } from "../../../prisma/data/colleges";

const streams = ["ENGINEERING", "MEDICAL", "MBA", "LAW"] as const;
const states = [
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Gujarat",
  "Rajasthan",
  "West Bengal",
  "Madhya Pradesh",
];

type SeedOptions = {
  clearExisting?: boolean;
  targetCount?: number;
  includeReviews?: boolean;
};

function makeSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function generateSyntheticColleges(targetCount: number) {
  const extra: any[] = [];
  let serial = 1;
  const used = new Set(colleges.map((c) => c.slug));

  while (colleges.length + extra.length < targetCount) {
    const state = states[serial % states.length];
    const stream = streams[serial % streams.length];
    const city = `${state.split(" ")[0]} City ${((serial - 1) % 25) + 1}`;
    const name = `${state} ${stream} Institute ${serial}`;
    const slug = makeSlug(name);
    if (used.has(slug)) {
      serial++;
      continue;
    }
    used.add(slug);

    const imageSeed = `eduvault-${slug}`;
    const baseFee = stream === "MEDICAL" ? 450000 : stream === "MBA" ? 600000 : 180000;
    const avgPackage = stream === "MEDICAL" ? 10 : stream === "MBA" ? 16 : 8;
    const exam = stream === "MEDICAL" ? "NEET" : stream === "MBA" ? "CAT" : "JEE_MAIN";

    extra.push({
      slug,
      name,
      shortDescription: `Leading ${stream.toLowerCase()} institute in ${state}`,
      overview: `${name} is known for academics, student outcomes, and industry alignment with modern infrastructure.`,
      location: `${city}, ${state}`,
      city,
      state,
      stream,
      fees: baseFee + (serial % 8) * 40000,
      rating: 3.6 + ((serial % 12) * 0.1),
      placementPercentage: 62 + (serial % 36),
      averagePackage: avgPackage + (serial % 10),
      highestPackage: avgPackage * 3 + (serial % 25),
      nirfRank: 120 + serial,
      naacGrade: ["A++", "A+", "A", "B++"][serial % 4],
      establishedYear: 1980 + (serial % 42),
      ownership: serial % 2 === 0 ? "PRIVATE" : "GOVERNMENT",
      approvedBy: "UGC, AICTE",
      campusArea: `${80 + (serial % 420)} acres`,
      imageUrl: `https://picsum.photos/seed/${imageSeed}-hero/1200/720`,
      logoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=256&bold=true`,
      galleryImages: [
        `https://picsum.photos/seed/${imageSeed}-campus/900/560`,
        `https://picsum.photos/seed/${imageSeed}-library/900/560`,
        `https://picsum.photos/seed/${imageSeed}-hostel/900/560`,
        `https://picsum.photos/seed/${imageSeed}-sports/900/560`,
      ],
      website: `https://www.${slug}.edu.in`,
      totalStudents: 1800 + (serial % 12000),
      totalFaculty: 120 + (serial % 880),
      courses: [
        {
          name: stream === "MEDICAL" ? "MBBS" : stream === "MBA" ? "MBA" : "B.Tech Computer Science",
          duration: stream === "MEDICAL" ? "5.5 years" : stream === "MBA" ? "2 years" : "4 years",
          fees: (baseFee + (serial % 8) * 40000) * (stream === "MBA" ? 2 : 4),
          eligibility: exam,
          seats: 60 + (serial % 180),
        },
      ],
      predictor: [
        {
          exam,
          minRank: Math.max(1, 2000 + serial * 10),
          maxRank: 2000 + serial * 10 + 18000,
        },
      ],
    });
    serial++;
  }

  return extra;
}

const reviewTitles = [
  "Excellent institution with great faculty",
  "Good infrastructure and campus life",
  "Amazing placement record",
  "Great learning environment",
  "World-class facilities",
];

const reviewComments = [
  "Strong academics with supportive faculty and solid placement opportunities.",
  "Campus environment is vibrant, with good labs and library facilities.",
  "Placements are consistently good, with strong recruiter participation.",
  "Peer learning and practical exposure make this a strong choice.",
  "Overall a positive and career-shaping experience.",
];

export async function runDatabaseSeed(options: SeedOptions = {}) {
  const clearExisting = options.clearExisting ?? true;
  const targetCount = options.targetCount ?? 1000;
  const includeReviews = options.includeReviews ?? false;

  if (clearExisting) {
    await prisma.answer.deleteMany();
    await prisma.question.deleteMany();
    await prisma.review.deleteMany();
    await prisma.predictor.deleteMany();
    await prisma.savedCollege.deleteMany();
    await prisma.savedComparison.deleteMany();
    await prisma.recentActivity.deleteMany();
    await prisma.course.deleteMany();
    await prisma.college.deleteMany();
    await prisma.user.deleteMany();
  }

  await prisma.user.createMany({
    data: [
      { name: "Alisha Tandon", email: "alisha@example.com", password: hashSync("password123", 10) },
      { name: "Rahul Sharma", email: "rahul@example.com", password: hashSync("password123", 10) },
      { name: "Priya Patel", email: "priya@example.com", password: hashSync("password123", 10) },
    ],
    skipDuplicates: true,
  });

  const expandedColleges = [...colleges, ...generateSyntheticColleges(targetCount)];
  const usedImages = new Set<string>();

  const collegeRows = expandedColleges.map((c) => {
    const uniqueImageUrl = c.imageUrl && !usedImages.has(c.imageUrl)
      ? c.imageUrl
      : `https://picsum.photos/seed/${c.slug}-hero-unique/1200/720`;
    usedImages.add(uniqueImageUrl);

    return {
      slug: c.slug,
      name: c.name,
      shortDescription: c.shortDescription,
      overview: c.overview,
      location: c.location,
      city: c.city,
      state: c.state,
      stream: c.stream as any,
      fees: c.fees,
      rating: c.rating,
      placementPercentage: c.placementPercentage,
      averagePackage: c.averagePackage,
      highestPackage: c.highestPackage,
      nirfRank: c.nirfRank,
      naacGrade: c.naacGrade,
      establishedYear: c.establishedYear,
      ownership: c.ownership as any,
      approvedBy: c.approvedBy || "UGC",
      campusArea: c.campusArea,
      imageUrl: uniqueImageUrl,
      logoUrl: c.logoUrl,
      galleryImages: c.galleryImages || [],
      website: c.website,
      latitude: c.latitude,
      longitude: c.longitude,
      totalStudents: c.totalStudents,
      totalFaculty: c.totalFaculty,
    };
  });

  await prisma.college.createMany({ data: collegeRows, skipDuplicates: true });

  const dbColleges = await prisma.college.findMany({
    where: { slug: { in: expandedColleges.map((c) => c.slug) } },
    select: { id: true, slug: true, rating: true },
  });
  const idBySlug = new Map(dbColleges.map((c) => [c.slug, c.id]));

  const courseRows: any[] = [];
  const predictorRows: any[] = [];
  for (const c of expandedColleges) {
    const collegeId = idBySlug.get(c.slug);
    if (!collegeId) continue;

    for (const course of c.courses || []) {
      courseRows.push({
        collegeId,
        name: course.name,
        duration: course.duration,
        fees: course.fees,
        eligibility: course.eligibility,
        seats: course.seats,
      });
    }

    for (const p of c.predictor || []) {
      predictorRows.push({
        collegeId,
        exam: p.exam,
        minRank: p.minRank,
        maxRank: p.maxRank,
      });
    }
  }

  if (courseRows.length) {
    await prisma.course.createMany({ data: courseRows });
  }
  if (predictorRows.length) {
    await prisma.predictor.createMany({ data: predictorRows });
  }

  if (includeReviews) {
    const users = await prisma.user.findMany({ select: { id: true } });
    if (users.length) {
      const reviewRows: any[] = [];
      dbColleges.slice(0, 400).forEach((college, idx) => {
        const user = users[idx % users.length];
        reviewRows.push({
          collegeId: college.id,
          userId: user.id,
          rating: Math.max(2.8, Math.min(5, college.rating - 0.2 + Math.random() * 0.4)),
          title: reviewTitles[idx % reviewTitles.length],
          comment: reviewComments[idx % reviewComments.length],
        });
      });
      if (reviewRows.length) {
        await prisma.review.createMany({ data: reviewRows });
      }
    }
  }

  return {
    colleges: collegeRows.length,
    courses: courseRows.length,
    predictors: predictorRows.length,
  };
}

