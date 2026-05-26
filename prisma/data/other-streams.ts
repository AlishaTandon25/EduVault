// Medical, MBA, Law, Design colleges
export const medicalColleges = [
  { slug: "aiims-delhi", name: "All India Institute of Medical Sciences Delhi", shortDescription: "India's premier medical institution", overview: "AIIMS Delhi is India's foremost medical institution, established in 1956. It sets the benchmark for medical education, research, and patient care in the country.", location: "New Delhi, Delhi", city: "New Delhi", state: "Delhi", stream: "MEDICAL", fees: 5000, rating: 4.9, placementPercentage: 100, averagePackage: 15.0, highestPackage: 30, nirfRank: 1, naacGrade: "A++", establishedYear: 1956, ownership: "GOVERNMENT", approvedBy: "NMC, UGC", campusArea: "109 acres", totalStudents: 3500, totalFaculty: 800, courses: [
    { name: "MBBS", duration: "5.5 years", fees: 30000, eligibility: "NEET UG", seats: 107 },
    { name: "MD General Medicine", duration: "3 years", fees: 25000, eligibility: "NEET PG / INI CET", seats: 20 },
    { name: "MS General Surgery", duration: "3 years", fees: 25000, eligibility: "NEET PG / INI CET", seats: 15 },
  ], predictor: [{ exam: "NEET", minRank: 1, maxRank: 200 }] },

  { slug: "cmc-vellore", name: "Christian Medical College Vellore", shortDescription: "One of India's most respected medical colleges", overview: "CMC Vellore is a premier medical institution known for compassionate healthcare and excellent medical education since 1900.", location: "Vellore, Tamil Nadu", city: "Vellore", state: "Tamil Nadu", stream: "MEDICAL", fees: 30000, rating: 4.8, placementPercentage: 100, averagePackage: 12.0, highestPackage: 25, nirfRank: 3, naacGrade: "A++", establishedYear: 1900, ownership: "PRIVATE", approvedBy: "NMC, UGC", campusArea: "265 acres", totalStudents: 2800, totalFaculty: 600, courses: [
    { name: "MBBS", duration: "5.5 years", fees: 180000, eligibility: "NEET UG", seats: 100 },
  ], predictor: [{ exam: "NEET", minRank: 1, maxRank: 500 }] },

  { slug: "jipmer-puducherry", name: "JIPMER Puducherry", shortDescription: "Institute of National Importance for medical education", overview: "JIPMER is a premier medical institution declared as an Institute of National Importance. Known for affordable world-class medical education.", location: "Puducherry, Puducherry", city: "Puducherry", state: "Puducherry", stream: "MEDICAL", fees: 8000, rating: 4.7, placementPercentage: 100, averagePackage: 13.0, highestPackage: 28, nirfRank: 4, naacGrade: "A++", establishedYear: 1823, ownership: "GOVERNMENT", approvedBy: "NMC, UGC", campusArea: "195 acres", totalStudents: 2200, totalFaculty: 500, courses: [
    { name: "MBBS", duration: "5.5 years", fees: 48000, eligibility: "NEET UG", seats: 150 },
  ], predictor: [{ exam: "NEET", minRank: 1, maxRank: 800 }] },

  { slug: "pgimer-chandigarh", name: "Post Graduate Institute of Medical Education & Research", shortDescription: "India's top postgraduate medical institute", overview: "PGIMER Chandigarh is India's premier institution for postgraduate medical education and advanced research in clinical sciences.", location: "Chandigarh, Chandigarh", city: "Chandigarh", state: "Chandigarh", stream: "MEDICAL", fees: 10000, rating: 4.8, placementPercentage: 100, averagePackage: 15.0, highestPackage: 30, nirfRank: 2, naacGrade: "A++", establishedYear: 1962, ownership: "GOVERNMENT", approvedBy: "NMC, UGC", campusArea: "260 acres", totalStudents: 3000, totalFaculty: 700, courses: [
    { name: "MD Internal Medicine", duration: "3 years", fees: 60000, eligibility: "NEET PG", seats: 30 },
  ], predictor: [{ exam: "NEET", minRank: 1, maxRank: 300 }] },

  { slug: "kmc-manipal", name: "Kasturba Medical College Manipal", shortDescription: "One of India's oldest and best private medical colleges", overview: "KMC Manipal is part of MAHE and is one of the oldest private medical colleges in India with excellent clinical training.", location: "Manipal, Karnataka", city: "Manipal", state: "Karnataka", stream: "MEDICAL", fees: 850000, rating: 4.5, placementPercentage: 98, averagePackage: 10.0, highestPackage: 22, nirfRank: 8, naacGrade: "A+", establishedYear: 1953, ownership: "PRIVATE", approvedBy: "NMC, UGC", campusArea: "600 acres", totalStudents: 2500, totalFaculty: 500, courses: [
    { name: "MBBS", duration: "5.5 years", fees: 5100000, eligibility: "NEET UG", seats: 250 },
  ], predictor: [{ exam: "NEET", minRank: 200, maxRank: 5000 }] },

  { slug: "mamc-delhi", name: "Maulana Azad Medical College Delhi", shortDescription: "Top government medical college in Delhi", overview: "MAMC Delhi is one of the most prestigious government medical colleges in India with nearly free education and outstanding clinical exposure.", location: "New Delhi, Delhi", city: "New Delhi", state: "Delhi", stream: "MEDICAL", fees: 7000, rating: 4.6, placementPercentage: 100, averagePackage: 12.0, highestPackage: 25, nirfRank: 5, naacGrade: "A+", establishedYear: 1958, ownership: "GOVERNMENT", approvedBy: "NMC, UGC", campusArea: "28 acres", totalStudents: 1800, totalFaculty: 350, courses: [
    { name: "MBBS", duration: "5.5 years", fees: 42000, eligibility: "NEET UG", seats: 250 },
  ], predictor: [{ exam: "NEET", minRank: 1, maxRank: 400 }] },

  { slug: "afmc-pune", name: "Armed Forces Medical College Pune", shortDescription: "India's premier military medical college", overview: "AFMC is a prestigious institution under the Indian Army providing medical education to train medical officers for the armed forces.", location: "Pune, Maharashtra", city: "Pune", state: "Maharashtra", stream: "MEDICAL", fees: 5000, rating: 4.6, placementPercentage: 100, averagePackage: 14.0, highestPackage: 20, nirfRank: 6, naacGrade: "A+", establishedYear: 1948, ownership: "GOVERNMENT", approvedBy: "NMC", campusArea: "125 acres", totalStudents: 1200, totalFaculty: 280, courses: [
    { name: "MBBS", duration: "5.5 years", fees: 30000, eligibility: "NEET UG + Interview", seats: 130 },
  ], predictor: [{ exam: "NEET", minRank: 1, maxRank: 600 }] },
];

export const mbaColleges = [
  { slug: "iim-ahmedabad", name: "Indian Institute of Management Ahmedabad", shortDescription: "India's #1 business school", overview: "IIM Ahmedabad is India's most prestigious business school, founded in 1961. Its PGP program is among the most sought-after MBA programs globally.", location: "Ahmedabad, Gujarat", city: "Ahmedabad", state: "Gujarat", stream: "MBA", fees: 1200000, rating: 4.9, placementPercentage: 100, averagePackage: 35.0, highestPackage: 110, nirfRank: 1, naacGrade: "A++", establishedYear: 1961, ownership: "GOVERNMENT", approvedBy: "UGC, AICTE", campusArea: "106 acres", totalStudents: 1200, totalFaculty: 120, courses: [
    { name: "PGP (MBA)", duration: "2 years", fees: 2800000, eligibility: "CAT", seats: 400 },
    { name: "PGPX (1-Year MBA)", duration: "1 year", fees: 3200000, eligibility: "GMAT", seats: 80 },
  ], predictor: [{ exam: "CAT", minRank: 1, maxRank: 200 }] },

  { slug: "iim-bangalore", name: "Indian Institute of Management Bangalore", shortDescription: "Asia's top-ranked B-school", overview: "IIM Bangalore is known for its strong emphasis on research, technology management, and public policy. One of the Triple Crown accredited B-schools.", location: "Bangalore, Karnataka", city: "Bangalore", state: "Karnataka", stream: "MBA", fees: 1200000, rating: 4.9, placementPercentage: 100, averagePackage: 34.0, highestPackage: 100, nirfRank: 2, naacGrade: "A++", establishedYear: 1973, ownership: "GOVERNMENT", approvedBy: "UGC, AICTE", campusArea: "100 acres", totalStudents: 1100, totalFaculty: 110, courses: [
    { name: "PGP (MBA)", duration: "2 years", fees: 2600000, eligibility: "CAT", seats: 440 },
  ], predictor: [{ exam: "CAT", minRank: 1, maxRank: 250 }] },

  { slug: "iim-calcutta", name: "Indian Institute of Management Calcutta", shortDescription: "First IIM established in India", overview: "IIM Calcutta was the first Indian Institute of Management, established in 1961 with collaboration from MIT Sloan. Known for its strong finance focus.", location: "Kolkata, West Bengal", city: "Kolkata", state: "West Bengal", stream: "MBA", fees: 1150000, rating: 4.8, placementPercentage: 100, averagePackage: 33.0, highestPackage: 95, nirfRank: 3, naacGrade: "A++", establishedYear: 1961, ownership: "GOVERNMENT", approvedBy: "UGC, AICTE", campusArea: "135 acres", totalStudents: 1000, totalFaculty: 100, courses: [
    { name: "PGP (MBA)", duration: "2 years", fees: 2700000, eligibility: "CAT", seats: 480 },
  ], predictor: [{ exam: "CAT", minRank: 1, maxRank: 300 }] },

  { slug: "iim-lucknow", name: "Indian Institute of Management Lucknow", shortDescription: "Top IIM with beautiful campus in the city of Nawabs", overview: "IIM Lucknow is known for its rigorous academic curriculum and stunning campus. Strong focus on operations and marketing.", location: "Lucknow, Uttar Pradesh", city: "Lucknow", state: "Uttar Pradesh", stream: "MBA", fees: 1050000, rating: 4.7, placementPercentage: 99, averagePackage: 28.0, highestPackage: 70, nirfRank: 4, naacGrade: "A++", establishedYear: 1984, ownership: "GOVERNMENT", approvedBy: "UGC, AICTE", campusArea: "200 acres", totalStudents: 950, totalFaculty: 95, courses: [
    { name: "PGP (MBA)", duration: "2 years", fees: 2100000, eligibility: "CAT", seats: 460 },
  ], predictor: [{ exam: "CAT", minRank: 1, maxRank: 500 }] },

  { slug: "iim-indore", name: "Indian Institute of Management Indore", shortDescription: "Top IIM with dual-campus advantage", overview: "IIM Indore operates from campuses in Indore and Mumbai, offering diverse management programs with strong industry connections.", location: "Indore, Madhya Pradesh", city: "Indore", state: "Madhya Pradesh", stream: "MBA", fees: 1000000, rating: 4.6, placementPercentage: 98, averagePackage: 25.0, highestPackage: 55, nirfRank: 5, naacGrade: "A+", establishedYear: 1996, ownership: "GOVERNMENT", approvedBy: "UGC, AICTE", campusArea: "193 acres", totalStudents: 900, totalFaculty: 85, courses: [
    { name: "PGP (MBA)", duration: "2 years", fees: 2000000, eligibility: "CAT", seats: 550 },
  ], predictor: [{ exam: "CAT", minRank: 1, maxRank: 700 }] },

  { slug: "xlri-jamshedpur", name: "XLRI - Xavier School of Management", shortDescription: "India's oldest private B-school", overview: "XLRI Jamshedpur, founded in 1949, is one of India's oldest and most prestigious private management schools, known for HR and business management.", location: "Jamshedpur, Jharkhand", city: "Jamshedpur", state: "Jharkhand", stream: "MBA", fees: 1300000, rating: 4.6, placementPercentage: 100, averagePackage: 28.5, highestPackage: 65, nirfRank: 6, naacGrade: "A+", establishedYear: 1949, ownership: "PRIVATE", approvedBy: "UGC, AICTE", campusArea: "23 acres", totalStudents: 850, totalFaculty: 75, courses: [
    { name: "PGDM (BM)", duration: "2 years", fees: 2600000, eligibility: "XAT/CAT/GMAT", seats: 180 },
    { name: "PGDM (HRM)", duration: "2 years", fees: 2600000, eligibility: "XAT/CAT", seats: 180 },
  ], predictor: [{ exam: "CAT", minRank: 1, maxRank: 600 }] },

  { slug: "fms-delhi", name: "Faculty of Management Studies, University of Delhi", shortDescription: "Most affordable top MBA in India", overview: "FMS Delhi is part of the University of Delhi and offers one of the most affordable top-tier MBA programs in the country with excellent ROI.", location: "New Delhi, Delhi", city: "New Delhi", state: "Delhi", stream: "MBA", fees: 25000, rating: 4.7, placementPercentage: 100, averagePackage: 32.0, highestPackage: 80, nirfRank: 7, naacGrade: "A+", establishedYear: 1954, ownership: "GOVERNMENT", approvedBy: "UGC", campusArea: "5 acres", totalStudents: 500, totalFaculty: 40, courses: [
    { name: "MBA", duration: "2 years", fees: 50000, eligibility: "CAT", seats: 220 },
  ], predictor: [{ exam: "CAT", minRank: 1, maxRank: 400 }] },

  { slug: "sp-jain-mumbai", name: "S.P. Jain Institute of Management & Research", shortDescription: "Top private B-school in Mumbai", overview: "SPJIMR is a leading private business school in Mumbai known for its unique pedagogy including rural immersion and values-based education.", location: "Mumbai, Maharashtra", city: "Mumbai", state: "Maharashtra", stream: "MBA", fees: 1000000, rating: 4.5, placementPercentage: 100, averagePackage: 26.0, highestPackage: 55, nirfRank: 10, naacGrade: "A+", establishedYear: 1981, ownership: "PRIVATE", approvedBy: "UGC, AICTE", campusArea: "45 acres", totalStudents: 600, totalFaculty: 55, courses: [
    { name: "PGDM", duration: "2 years", fees: 2100000, eligibility: "CAT/XAT/GMAT", seats: 240 },
  ], predictor: [{ exam: "CAT", minRank: 1, maxRank: 800 }] },
];

export const lawColleges = [
  { slug: "nlsiu-bangalore", name: "National Law School of India University Bangalore", shortDescription: "India's #1 law school", overview: "NLSIU Bangalore is India's premier law university, established in 1987. It pioneered the 5-year integrated law program model in India.", location: "Bangalore, Karnataka", city: "Bangalore", state: "Karnataka", stream: "LAW", fees: 250000, rating: 4.8, placementPercentage: 98, averagePackage: 18.0, highestPackage: 40, nirfRank: 1, naacGrade: "A++", establishedYear: 1987, ownership: "GOVERNMENT", approvedBy: "BCI, UGC", campusArea: "23 acres", totalStudents: 650, totalFaculty: 45, courses: [
    { name: "BA LLB (Hons)", duration: "5 years", fees: 1250000, eligibility: "CLAT", seats: 120 },
  ], predictor: [{ exam: "CLAT", minRank: 1, maxRank: 100 }] },

  { slug: "nalsar-hyderabad", name: "NALSAR University of Law Hyderabad", shortDescription: "Top-ranked national law university in Telangana", overview: "NALSAR Hyderabad is consistently ranked among India's top 3 law schools with excellent faculty and placement record.", location: "Hyderabad, Telangana", city: "Hyderabad", state: "Telangana", stream: "LAW", fees: 230000, rating: 4.7, placementPercentage: 96, averagePackage: 16.0, highestPackage: 35, nirfRank: 2, naacGrade: "A++", establishedYear: 1998, ownership: "GOVERNMENT", approvedBy: "BCI, UGC", campusArea: "40 acres", totalStudents: 500, totalFaculty: 40, courses: [
    { name: "BA LLB (Hons)", duration: "5 years", fees: 1150000, eligibility: "CLAT", seats: 120 },
  ], predictor: [{ exam: "CLAT", minRank: 1, maxRank: 150 }] },

  { slug: "nlu-delhi", name: "National Law University Delhi", shortDescription: "Top law school in the national capital", overview: "NLU Delhi has quickly risen to become one of India's top law schools since its establishment in 2008. Strong focus on legal research.", location: "New Delhi, Delhi", city: "New Delhi", state: "Delhi", stream: "LAW", fees: 200000, rating: 4.7, placementPercentage: 97, averagePackage: 17.0, highestPackage: 38, nirfRank: 3, naacGrade: "A+", establishedYear: 2008, ownership: "GOVERNMENT", approvedBy: "BCI, UGC", campusArea: "15 acres", totalStudents: 600, totalFaculty: 40, courses: [
    { name: "BA LLB (Hons)", duration: "5 years", fees: 1000000, eligibility: "AILET", seats: 120 },
  ], predictor: [{ exam: "CLAT", minRank: 1, maxRank: 120 }] },

  { slug: "nujs-kolkata", name: "West Bengal National University of Juridical Sciences", shortDescription: "Leading NLU in eastern India", overview: "NUJS Kolkata is a premier law university in eastern India known for strong corporate law placements.", location: "Kolkata, West Bengal", city: "Kolkata", state: "West Bengal", stream: "LAW", fees: 220000, rating: 4.5, placementPercentage: 94, averagePackage: 14.0, highestPackage: 30, nirfRank: 4, naacGrade: "A+", establishedYear: 1999, ownership: "GOVERNMENT", approvedBy: "BCI, UGC", campusArea: "8 acres", totalStudents: 500, totalFaculty: 35, courses: [
    { name: "BA LLB (Hons)", duration: "5 years", fees: 1100000, eligibility: "CLAT", seats: 108 },
  ], predictor: [{ exam: "CLAT", minRank: 1, maxRank: 200 }] },

  { slug: "nlu-jodhpur", name: "National Law University Jodhpur", shortDescription: "Premier NLU in Rajasthan", overview: "NLU Jodhpur is known for its strong moot court culture and excellent legal education in the desert state of Rajasthan.", location: "Jodhpur, Rajasthan", city: "Jodhpur", state: "Rajasthan", stream: "LAW", fees: 200000, rating: 4.4, placementPercentage: 90, averagePackage: 12.0, highestPackage: 28, nirfRank: 5, naacGrade: "A", establishedYear: 1999, ownership: "GOVERNMENT", approvedBy: "BCI, UGC", campusArea: "16 acres", totalStudents: 550, totalFaculty: 35, courses: [
    { name: "BA LLB (Hons)", duration: "5 years", fees: 1000000, eligibility: "CLAT", seats: 130 },
  ], predictor: [{ exam: "CLAT", minRank: 1, maxRank: 300 }] },
];

export const designColleges = [
  { slug: "nid-ahmedabad", name: "National Institute of Design Ahmedabad", shortDescription: "India's premier design institution", overview: "NID Ahmedabad is India's most prestigious design school, established in 1961 with guidance from Charles and Ray Eames.", location: "Ahmedabad, Gujarat", city: "Ahmedabad", state: "Gujarat", stream: "DESIGN", fees: 120000, rating: 4.8, placementPercentage: 95, averagePackage: 12.0, highestPackage: 30, nirfRank: 1, naacGrade: "A+", establishedYear: 1961, ownership: "GOVERNMENT", approvedBy: "DPIIT", campusArea: "35 acres", totalStudents: 900, totalFaculty: 80, courses: [
    { name: "B.Des (4-year)", duration: "4 years", fees: 480000, eligibility: "NID DAT", seats: 90 },
  ], predictor: [{ exam: "NIFT", minRank: 1, maxRank: 200 }] },

  { slug: "nift-delhi", name: "National Institute of Fashion Technology Delhi", shortDescription: "India's top fashion and design school", overview: "NIFT Delhi is the flagship campus of India's premier fashion technology institution, offering world-class fashion design education.", location: "New Delhi, Delhi", city: "New Delhi", state: "Delhi", stream: "DESIGN", fees: 200000, rating: 4.6, placementPercentage: 92, averagePackage: 8.0, highestPackage: 22, nirfRank: 2, naacGrade: "A+", establishedYear: 1986, ownership: "GOVERNMENT", approvedBy: "UGC", campusArea: "7 acres", totalStudents: 1200, totalFaculty: 95, courses: [
    { name: "B.Des Fashion Design", duration: "4 years", fees: 800000, eligibility: "NIFT Entrance", seats: 120 },
  ], predictor: [{ exam: "NIFT", minRank: 1, maxRank: 500 }] },

  { slug: "srishti-bangalore", name: "Srishti Manipal Institute of Art, Design and Technology", shortDescription: "Innovative design school in Bangalore", overview: "Srishti is known for its interdisciplinary approach to design education, combining art, technology, and social impact.", location: "Bangalore, Karnataka", city: "Bangalore", state: "Karnataka", stream: "DESIGN", fees: 350000, rating: 4.1, placementPercentage: 82, averagePackage: 6.0, highestPackage: 15, nirfRank: 8, naacGrade: "A", establishedYear: 1996, ownership: "PRIVATE", approvedBy: "UGC", campusArea: "4 acres", totalStudents: 1500, totalFaculty: 120, courses: [
    { name: "B.Des Human-Centered Design", duration: "4 years", fees: 1400000, eligibility: "Srishti Entrance", seats: 80 },
  ], predictor: [{ exam: "NIFT", minRank: 200, maxRank: 2000 }] },
];
