export type ApplicationCard = {
  id: number;
  create_date: string;
  title: string;
  status: "Apply" | "Open";
  detail: string;
  skillMatch: string;
  highlighted?: boolean;
};

export type ActivityCard = {
  id: number;
  create_date: string;
  title: string;
  status: "Open" | "Apply";
  period: string;
  applied: string;
  badgeText: string;
  highlighted?: boolean;
};

const baseNewAppliedCards: Omit<ApplicationCard, "create_date">[] = [
  {
    id: 1,
    title: "Chotanansub Sophaken",
    status: "Apply",
    detail: "Applied In: Personal Assistant 25 - 35 K (WFH 80%)",
    skillMatch: "3 Skill Match",
    highlighted: true,
  },
  {
    id: 2,
    title: "Chotanansub Sophaken",
    status: "Apply",
    detail:
      "Applied In: Personal Assistant 25 - 35 K (WFH 80%) at Jobby Employer, Bangkok head office operations and coordination team",
    skillMatch: "3 Skill Match",
    highlighted: true,
  },
  {
    id: 3,
    title: "Chotanansub Sophaken",
    status: "Apply",
    detail: "Applied In: Personal Assistant 25 - 35 K (WFH 80%)",
    skillMatch: "3 Skill Match",
    highlighted: true,
  },
  {
    id: 4,
    title: "Chotanansub Sophaken",
    status: "Apply",
    detail: "Applied In: Personal Assistant 25 - 35 K (WFH 80%)",
    skillMatch: "3 Skill Match",
  },
  {
    id: 5,
    title: "Chotanansub Sophaken",
    status: "Apply",
    detail:
      "Applied In: Personal Assistant 25 - 35 K (WFH 80%) with cross-functional scheduling, reporting, and stakeholder support responsibilities",
    skillMatch: "3 Skill Match",
  },
  {
    id: 6,
    title: "Chotanansub Sophaken",
    status: "Apply",
    detail:
      "Applied In: Personal Assistant 25 - 35 K (WFH 80%) for executive support, calendar planning, meeting prep, and documentation follow-up",
    skillMatch: "3 Skill Match",
  },
  {
    id: 7,
    title: "Nattapong K.",
    status: "Apply",
    detail: "Applied In: Operation Coordinator 28 - 40 K (Hybrid 60%)",
    skillMatch: "2 Skill Match",
    highlighted: true,
  },
  {
    id: 8,
    title: "Sudarat P.",
    status: "Apply",
    detail:
      "Applied In: Executive Assistant 30 - 45 K (WFH 50%) with travel planning and cross-team communication",
    skillMatch: "4 Skill Match",
    highlighted: true,
  },
  {
    id: 9,
    title: "Kanin T.",
    status: "Apply",
    detail: "Applied In: Personal Assistant 25 - 35 K (WFH 80%)",
    skillMatch: "3 Skill Match",
  },
  {
    id: 10,
    title: "Ploy N.",
    status: "Apply",
    detail:
      "Applied In: Team Assistant 24 - 32 K (Onsite) for reporting, schedule support, and admin coordination",
    skillMatch: "2 Skill Match",
  },
  {
    id: 11,
    title: "Thanawat R.",
    status: "Apply",
    detail: "Applied In: Business Support Assistant 26 - 34 K (Hybrid)",
    skillMatch: "1 Skill Match",
  },
  {
    id: 12,
    title: "Pitchaya S.",
    status: "Apply",
    detail:
      "Applied In: Personal Assistant 25 - 35 K (WFH 80%) handling meetings, minutes, and executive documentation",
    skillMatch: "3 Skill Match",
  },
  {
    id: 13,
    title: "Worawit L.",
    status: "Apply",
    detail: "Applied In: Executive Coordinator 32 - 42 K (Hybrid 50%)",
    skillMatch: "2 Skill Match",
    highlighted: true,
  },
  {
    id: 14,
    title: "Benjamas A.",
    status: "Apply",
    detail:
      "Applied In: Personal Assistant 25 - 35 K (WFH 80%) for stakeholder scheduling and weekly reporting support",
    skillMatch: "3 Skill Match",
    highlighted: true,
  },
  {
    id: 15,
    title: "Kritsada V.",
    status: "Apply",
    detail: "Applied In: Team Operations Assistant 27 - 36 K (Onsite)",
    skillMatch: "1 Skill Match",
  },
  {
    id: 16,
    title: "Siriporn M.",
    status: "Apply",
    detail:
      "Applied In: Business Assistant 26 - 34 K (Hybrid) for document control, meeting notes, and calendar follow-up",
    skillMatch: "2 Skill Match",
  },
  {
    id: 17,
    title: "Narin P.",
    status: "Apply",
    detail: "Applied In: Admin & Support Coordinator 24 - 33 K (WFH 40%)",
    skillMatch: "2 Skill Match",
    highlighted: true,
  },
  {
    id: 18,
    title: "Jirapat K.",
    status: "Apply",
    detail:
      "Applied In: Personal Assistant 25 - 35 K (WFH 80%) with event coordination and executive communication support",
    skillMatch: "4 Skill Match",
  },
  {
    id: 19,
    title: "Patcharin T.",
    status: "Apply",
    detail: "Applied In: Operations Assistant 28 - 38 K (Hybrid)",
    skillMatch: "3 Skill Match",
    highlighted: true,
  },
  {
    id: 20,
    title: "Ratchanon B.",
    status: "Apply",
    detail:
      "Applied In: Executive Assistant 30 - 45 K (WFH 50%) for travel planning, filing, and document approvals",
    skillMatch: "2 Skill Match",
  },
  {
    id: 21,
    title: "Phimchanok Y.",
    status: "Apply",
    detail: "Applied In: Team Assistant 24 - 32 K (Onsite)",
    skillMatch: "1 Skill Match",
  },
  {
    id: 22,
    title: "Kittipong N.",
    status: "Apply",
    detail:
      "Applied In: Personal Assistant 25 - 35 K (WFH 80%) to support cross-team scheduling and progress tracking",
    skillMatch: "3 Skill Match",
    highlighted: true,
  },
  {
    id: 23,
    title: "Sasima R.",
    status: "Apply",
    detail: "Applied In: Office Coordination Specialist 26 - 35 K (Hybrid)",
    skillMatch: "2 Skill Match",
  },
  {
    id: 24,
    title: "Thanida C.",
    status: "Apply",
    detail:
      "Applied In: Executive Support Assistant 29 - 39 K (WFH 60%) for meetings, summaries, and stakeholder communication",
    skillMatch: "4 Skill Match",
    highlighted: true,
  },
];

export const newAppliedCards: ApplicationCard[] = baseNewAppliedCards.map((card, index) => ({
  ...card,
  create_date: `2025-12-${String(31 - index).padStart(2, "0")}T09:${String(index).padStart(2, "0")}:00Z`,
}));

const baseActivityCards: Omit<ActivityCard, "create_date">[] = [
  {
    id: 1,
    title: "Personal Assistant 25 - 35 K (WFH 80%)",
    status: "Open",
    period: "12 Oct 2025 - 30 Nov 2025",
    applied: "3123 Applied",
    badgeText: "2 New Applied",
    highlighted: true,
  },
  {
    id: 2,
    title: "Operation Coordinator 28 - 40 K (Hybrid 60%)",
    status: "Open",
    period: "03 Nov 2025 - 22 Dec 2025",
    applied: "874 Applied",
    badgeText: "18 New Applied",
    highlighted: true,
  },
  {
    id: 3,
    title: "Executive Assistant 30 - 45 K (WFH 50%)",
    status: "Apply",
    period: "18 Sep 2025 - 15 Nov 2025",
    applied: "1296 Applied",
    badgeText: "7 New Applied",
    highlighted: true,
  },
  {
    id: 4,
    title: "Team Assistant 24 - 32 K (Onsite)",
    status: "Open",
    period: "25 Oct 2025 - 08 Dec 2025",
    applied: "452 Applied",
    badgeText: "",
  },
  {
    id: 5,
    title: "Business Support Assistant 26 - 34 K (Hybrid)",
    status: "Apply",
    period: "02 Nov 2025 - 28 Dec 2025",
    applied: "639 Applied",
    badgeText: "",
  },
  {
    id: 6,
    title: "Executive Coordinator 32 - 42 K (Hybrid 50%)",
    status: "Open",
    period: "10 Oct 2025 - 20 Nov 2025",
    applied: "1004 Applied",
    badgeText: "",
  },
  {
    id: 7,
    title: "Admin & Support Coordinator 24 - 33 K (WFH 40%)",
    status: "Apply",
    period: "14 Nov 2025 - 10 Jan 2026",
    applied: "518 Applied",
    badgeText: "",
  },
  {
    id: 8,
    title: "Office Coordination Specialist 26 - 35 K (Hybrid)",
    status: "Open",
    period: "01 Dec 2025 - 31 Jan 2026",
    applied: "233 Applied",
    badgeText: "",
  },
  {
    id: 9,
    title: "Team Operations Assistant 27 - 36 K (Onsite)",
    status: "Apply",
    period: "05 Nov 2025 - 18 Dec 2025",
    applied: "721 Applied",
    badgeText: "",
  },
];

export const activityCards: ActivityCard[] = baseActivityCards.map((card, index) => ({
  ...card,
  create_date: `2025-11-${String(30 - index).padStart(2, "0")}T10:${String(index).padStart(2, "0")}:00Z`,
}));

export const applyStatusOptions = [
  { label: "Apply", value: "apply" },
  { label: "Open", value: "open" },
];

export const jobStatusOptions = [
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
];

export const workCategoryOptions = [
  { label: "Technology", value: "technology" },
  { label: "Operations", value: "operations" },
  { label: "Business", value: "business" },
];

export const skillOptions = [
  { label: "React", value: "react" },
  { label: "Excel", value: "excel" },
  { label: "Communication", value: "communication" },
];
