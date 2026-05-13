import PageLayout from "@/components/layout/PageLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Multiselect, {
  type MultiselectOption,
} from "@/components/ui/multiselect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  jobMonitorLatestCards,
  jobMonitorNewAppliedCards,
} from "@/mock/jobMonitorMock";
import type { JobMonitorCard } from "@/types/domain/job-monitor";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import JobMonitorDetailPopup from "@/pages/jobmonitor/JobMonitorDetailPopup";

const jobStatusOptions: MultiselectOption[] = [
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
];

export default function JobMonitorPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusValues, setStatusValues] = useState<string[]>([
    "open",
    "closed",
  ]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<JobMonitorCard | null>(null);

  const gradientBorderStyle = {
    border: "1px solid transparent",
    backgroundImage:
      "linear-gradient(var(--card), var(--card)), var(--gradient-primary)",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
  } as const;

  const sortCards = useCallback(
    (cards: JobMonitorCard[]) => {
      const sortedCards = [...cards].sort(
        (firstCard, secondCard) => firstCard.id - secondCard.id,
      );
      return sortBy === "oldest" ? sortedCards : sortedCards.reverse();
    },
    [sortBy],
  );

  const filterCards = useCallback(
    (cards: JobMonitorCard[]) => {
      const normalizedQuery = searchQuery.trim().toLowerCase();

      const filteredCards = cards.filter((card) => {
        const matchesSearch =
          normalizedQuery.length === 0 ||
          [card.title, card.status, card.period, card.applied].some((value) =>
            value.toLowerCase().includes(normalizedQuery),
          );
        const matchesStatus =
          statusValues.length === 0 || statusValues.includes(card.jobStatus);

        return matchesSearch && matchesStatus;
      });

      return sortCards(filteredCards);
    },
    [searchQuery, sortCards, statusValues],
  );

  const newAppliedCards = useMemo(
    () => filterCards(jobMonitorNewAppliedCards),
    [filterCards],
  );

  const latestCards = useMemo(
    () => filterCards(jobMonitorLatestCards),
    [filterCards],
  );

  const handleOpenDetailPopup = (card: JobMonitorCard) => {
    setSelectedCard(card);
    setIsDetailPopupOpen(true);
  };

  const renderCard = (card: JobMonitorCard) => (
    <article
      key={card.id}
      className="rounded-xl border border-border bg-card px-4 py-3 min-h-33.5 flex flex-col"
    >
      <h3 className="text-sm font-medium leading-5 line-clamp-2">
        {card.title}
      </h3>
      <p className="mt-1 text-xs">
        Status: <span className="text-primary">{card.status}</span>
      </p>
      <p className="text-muted-foreground text-[11px]">{card.period}</p>
      <p className="text-muted-foreground text-[11px]">{card.applied}</p>

      <div className="mt-auto flex justify-end pt-2">
        <Button
          variant="ghost"
          size="xs"
          className="hover:bg-transparent rounded-full border bg-transparent px-6"
          style={gradientBorderStyle}
          onClick={() => handleOpenDetailPopup(card)}
        >
          <span className="gradient-text">View Job</span>
        </Button>
      </div>
    </article>
  );

  return (
    <PageLayout>
      <div className="w-full bg-background px-6 py-6 overflow-y-auto">
        <div className="mx-auto max-w-6xl ml-4">
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
                  <BreadcrumbPage>Job Monitor</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <h1 className="text-3xl font-medium mt-[3%] ml-[-1%]">Job Monitor</h1>

          <section className="mt-[2%] mb-4 grid grid-cols-1 gap-3 md:grid-cols-10">
            <div className="md:col-span-4">
              <p className="text-foreground mb-1 text-base font-medium">
                Search
              </p>
              <Input
                placeholder="Search name"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <div className="md:col-span-3">
              <p className="text-foreground mb-1 text-base font-medium">
                Status
              </p>
              <Multiselect
                options={jobStatusOptions}
                selectedValues={statusValues}
                onSelectedValuesChange={setStatusValues}
                placeholder="Select"
              />
            </div>
            <div className="md:col-span-3">
              <p className="text-foreground mb-1 text-base font-medium">
                Sort By
              </p>
              <Select
                value={sortBy}
                onValueChange={(value) =>
                  setSortBy(value as "newest" | "oldest")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          <section className="mb-4">
            <h2 className="text-foreground mb-2 text-lg font-semibold">
              New Applied
            </h2>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
              {newAppliedCards.map(renderCard)}
            </div>
          </section>

          <section>
            <h2 className="text-foreground mb-2 text-lg font-semibold">
              Latest Job activities
            </h2>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
              {latestCards.map(renderCard)}
            </div>
          </section>

          <JobMonitorDetailPopup
            open={isDetailPopupOpen}
            onOpenChange={setIsDetailPopupOpen}
            card={selectedCard}
          />
        </div>
      </div>
    </PageLayout>
  );
}
