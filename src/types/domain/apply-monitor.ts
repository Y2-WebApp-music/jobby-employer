import type { ReactNode } from "react";

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

export type ApplymonitorPopupPageProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: ApplicationCard | null;
};

export type ApplymonitorRejectPopupProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type ApplymonitorSkillPopupProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skillName: string;
};

export type ApplymonitorFilterPopupProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};
