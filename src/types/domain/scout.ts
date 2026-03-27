export type ScoutCandidate = {
  id: number;
  name: string;
  matchJob: string;
  description: string;
  skillMatch: string;
  createdAt: number;
};

export type ScoutCandidateCardProps = {
  candidate: ScoutCandidate;
  isStarSelected: boolean;
  onToggleStar: (candidateId: number) => void;
};
