import PageLayout from "@/components/layout/PageLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import SectionPagination from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ScoutCandidate } from "@/types/domain/scout";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ScoutCandidateCard from "./components/ScoutCandidateCard";

const scoutMock: ScoutCandidate[] = Array.from({ length: 15 }, (_, index) => ({
  id: index + 1,
  name: "Chotanansub Sophaken",
  matchJob: "Personal Assistant 25 - 35 K (WFH 80%)",
  description: "ยินพัฒนาการ ยินดีรับนักศึกษาจบใหม่",
  skillMatch: "3 Skill Match",
  createdAt: 1000 - index,
}));

const perPage = 15;

export default function ScoutPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStars, setSelectedStars] = useState<Record<number, boolean>>(
    {},
  );

  const filteredCandidates = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const matched = scoutMock.filter((candidate) => {
      const isNameMatched = candidate.name
        .toLowerCase()
        .includes(normalizedQuery);
      const isJobMatched =
        selectedJob === "all" || candidate.matchJob === selectedJob;
      const isFilterMatched =
        selectedFilter === "all" || candidate.skillMatch === selectedFilter;

      return isNameMatched && isJobMatched && isFilterMatched;
    });

    return [...matched].sort((first, second) => {
      if (sortBy === "oldest") {
        return first.createdAt - second.createdAt;
      }

      if (sortBy === "name") {
        return first.name.localeCompare(second.name);
      }

      return second.createdAt - first.createdAt;
    });
  }, [searchQuery, selectedFilter, selectedJob, sortBy]);

  const pagedCandidates = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredCandidates.slice(start, start + perPage);
  }, [currentPage, filteredCandidates]);

  const jobOptions = [
    "all",
    ...Array.from(new Set(scoutMock.map((candidate) => candidate.matchJob))),
  ];

  const toggleStar = (candidateId: number) => {
    setSelectedStars((previous) => ({
      ...previous,
      [candidateId]: !previous[candidateId],
    }));
  };

  return (
    <PageLayout>
      <div className="w-full overflow-y-auto bg-background px-6 py-6">
        <div className="mx-auto ml-4 max-w-6xl">
          <div className="mb-3 mx-[1%]">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/applymonitor">Apply</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Scout</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="mb-4 flex items-baseline gap-2">
            <h1 className="text-4xl font-semibold text-foreground sm:text-2xl">
              Scout
            </h1>
            <span className="text-4xl font-semibold text-destructive sm:text-2xl">
              (TBC)
            </span>
          </div>

          <section className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="mb-1 text-base font-medium">Search</p>
              <Input
                placeholder="Search name"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="md:col-span-5">
              <p className="mb-1 text-base font-medium">Job name</p>
              <Select
                value={selectedJob}
                onValueChange={(value) => {
                  setSelectedJob(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All jobs</SelectItem>
                  {jobOptions
                    .filter((jobOption) => jobOption !== "all")
                    .map((jobOption) => (
                      <SelectItem key={jobOption} value={jobOption}>
                        {jobOption}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <p className="mb-1 text-base font-medium">Filter</p>
              <Select
                value={selectedFilter}
                onValueChange={(value) => {
                  setSelectedFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="3 Skill Match">3 Skill Match</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <p className="mb-1 text-base font-medium">Sort By</p>
              <Select
                value={sortBy}
                onValueChange={(value) => {
                  setSortBy(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {pagedCandidates.map((candidate) => (
              <ScoutCandidateCard
                key={candidate.id}
                candidate={candidate}
                isStarSelected={Boolean(selectedStars[candidate.id])}
                onToggleStar={toggleStar}
              />
            ))}
          </section>

          <SectionPagination
            total={filteredCandidates.length}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            perPage={perPage}
          />
        </div>
      </div>
    </PageLayout>
  );
}
