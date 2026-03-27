import type { CandidateCard, SectionConfig } from "@/types/domain/apply-by-title";

const candidateNames = [
  "Chotanansub Sophaken",
  "Nattapong Kittisak",
  "Pimchanok Rattanakul",
  "Thanapat Siripong",
  "Ananya Srisawat",
  "Kritsada Maneerat",
  "Suphansa Wongchai",
  "Patchara Boonmee",
  "Natthida Chaisri",
  "Rinrada Thepsiri",
  "Karn Tanapong",
  "Saran Charoenkit",
];

const skillMatchLabels = [
  "2 Skill Match",
  "3 Skill Match",
  "4 Skill Match",
  "5 Skill Match",
  "Strong Portfolio",
  "Fast Learner",
];

const appliedDates = [
  "Applied: 18 Sep 2025 09:12",
  "Applied: 24 Sep 2025 14:05",
  "Applied: 01 Oct 2025 10:33",
  "Applied: 07 Oct 2025 16:48",
  "Applied: 12 Oct 2025 15:46",
  "Applied: 19 Oct 2025 08:57",
  "Applied: 26 Oct 2025 13:21",
  "Applied: 31 Oct 2025 11:40",
  "Applied: 03 Nov 2025 17:09",
  "Applied: 08 Nov 2025 12:16",
];

const badgeTextLabels = [
  "React",
  "React + TypeScript",
  "3 Years in Product Team",
  "Built Internal Dashboard for 2 Departments",
  "Led End-to-End Feature Delivery Across Web and Mobile",
  "Handled High-traffic Release Planning and Cross-team Coordination",
];

const sectionConfigs: SectionConfig[] = [
  { section: "newApplied", count: 18, status: "Apply", highlightVariant: "gradient" },
  { section: "applied", count: 45, status: "Apply" },
  { section: "interview", count: 18, status: "Interview", highlightVariant: "pink" },
  { section: "accept", count: 18, status: "Accept", highlightVariant: "green" },
  { section: "reject", count: 27, status: "Reject" },
];

let runningId = 1;

export const applybytitleMock: CandidateCard[] = sectionConfigs.flatMap((config, sectionIndex) =>
  Array.from({ length: config.count }, (_, index) => {
    const id = runningId;
    runningId += 1;

    return {
      id,
      name: candidateNames[(index + sectionIndex * 2) % candidateNames.length],
      status: config.status,
      section: config.section,
      appliedAt: appliedDates[(index + sectionIndex * 3) % appliedDates.length],
      badgeText: badgeTextLabels[(index + sectionIndex * 4) % badgeTextLabels.length],
      skillMatch: skillMatchLabels[(index + sectionIndex) % skillMatchLabels.length],
      viewed: config.section === "newApplied" ? index % 4 === 0 : index % 3 !== 0,
      highlightVariant: config.highlightVariant,
    };
  }),
);
