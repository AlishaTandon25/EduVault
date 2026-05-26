import { PrismaClient } from "@prisma/client";
import { colleges } from "./data/colleges";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

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

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
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

  // Create demo users
  const users = await Promise.all([
    prisma.user.create({ data: { name: "Alisha Tandon", email: "alisha@example.com", password: hashSync("password123", 10) } }),
    prisma.user.create({ data: { name: "Rahul Sharma", email: "rahul@example.com", password: hashSync("password123", 10) } }),
    prisma.user.create({ data: { name: "Priya Patel", email: "priya@example.com", password: hashSync("password123", 10) } }),
  ]);

  const expandedColleges = [...colleges, ...generateSyntheticColleges(1000)];
  const usedImages = new Set<string>();

  let count = 0;
  for (const c of expandedColleges) {
    const uniqueImageUrl = c.imageUrl && !usedImages.has(c.imageUrl)
      ? c.imageUrl
      : `https://picsum.photos/seed/${c.slug}-hero-unique/1200/720`;
    usedImages.add(uniqueImageUrl);

    const college = await prisma.college.create({
      data: {
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
        courses: { create: c.courses },
      },
    });

    // Add 1-3 reviews per college
    const reviewCount = 1 + (count % 3);
    for (let i = 0; i < reviewCount; i++) {
      const user = users[i % users.length];
      await prisma.review.create({
        data: {
          rating: c.rating - 0.2 + Math.random() * 0.4,
          title: reviewTitles[count % reviewTitles.length],
          comment: reviewComments[count % reviewComments.length],
          userId: user.id,
          collegeId: college.id,
        },
      });
    }

    // Add predictor data if applicable
    if (c.predictor) {
      for (const p of c.predictor) {
        await prisma.predictor.create({
          data: { exam: p.exam, minRank: p.minRank, maxRank: p.maxRank, collegeId: college.id },
        });
      }
    }

    count++;
    if (count % 25 === 0) console.log(`  ✅ Seeded ${count} colleges...`);
  }

  console.log(`🎉 Seeded ${count} colleges, ${users.length} users`);
}

const reviewTitles = [
  "Excellent institution with great faculty",
  "Good infrastructure and campus life",
  "Amazing placement record",
  "Great learning environment",
  "World-class facilities",
  "Solid academic foundation",
  "Wonderful campus experience",
  "Strong industry connections",
  "Top-notch research opportunities",
  "Best decision of my life",
];

const reviewComments = [
  "The academic rigor here is exceptional. Professors are always available for guidance and the curriculum is industry-relevant.",
  "Campus facilities are modern and well-maintained. The library is extensive and the labs are equipped with latest technology.",
  "Placement cell is very active. Most students receive multiple offers from top companies. The average package has been increasing every year.",
  "The peer group here is incredibly talented and driven. You learn as much from classmates as from professors.",
  "Research opportunities are abundant. Students regularly publish in top-tier conferences and journals.",
  "The alumni network is incredibly strong and helpful for career guidance and placement referrals.",
  "Cultural life on campus is vibrant with numerous clubs, fests, and extracurricular activities.",
  "Industry collaborations bring real-world projects and internship opportunities right to campus.",
  "The entrepreneurship ecosystem is thriving with dedicated incubation centers and mentorship programs.",
  "Overall a transformative experience that shaped my career trajectory in the best possible way.",
];

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
