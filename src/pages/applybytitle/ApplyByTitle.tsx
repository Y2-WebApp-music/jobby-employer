import PageLayout from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/badge";
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
import SectionPagination from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  applybytitleMock,
  type CandidateCard,
} from "@/mock/applybytitleMock";
import ApplyByTitleFilterPopup from "@/pages/applybytitle/ApplyByTitleFilterPopup";
import ApplyByTitleJobDetailPopup from "@/pages/applybytitle/ApplyByTitleJobDetailPopup";
import ApplyByTitleNewAppliedPopup from "@/pages/applybytitle/ApplyByTitleNewAppliedPopup";
import { Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

type ApplyStatusFilter = "all" | "apply" | "interview" | "accept" | "reject";

const perPageBySection = {
  newApplied: 6,
  applied: 15,
  interview: 6,
  accept: 6,
  reject: 9,
} as const;

export default function ApplyByTitlePage() {
  const { title } = useParams();
  const decodedTitle = title ?? "Personal Assistant 25 - 35 K (WFH 80%)";
  const gradientBorderStyle = {
    border: "1px solid transparent",
    backgroundImage:
      "linear-gradient(var(--card), var(--card)), var(--gradient-primary)",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
  } as const;

  const [newAppliedPage, setNewAppliedPage] = useState(1);
  const [appliedPage, setAppliedPage] = useState(1);
  const [interviewPage, setInterviewPage] = useState(1);
  const [acceptPage, setAcceptPage] = useState(1);
  const [rejectPage, setRejectPage] = useState(1);
  const [selectedStars, setSelectedStars] = useState<Record<number, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [applyStatusFilter, setApplyStatusFilter] = useState<ApplyStatusFilter>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [isJobDetailPopupOpen, setIsJobDetailPopupOpen] = useState(false);
  const [isNewAppliedPopupOpen, setIsNewAppliedPopupOpen] = useState(false);
  const [selectedNewAppliedCard, setSelectedNewAppliedCard] = useState<CandidateCard | null>(null);

  const sectionedCards = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const matchesSearchAndFilter = (card: CandidateCard) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [card.name, card.status, card.appliedAt, card.skillMatch].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );

      const matchesApplyStatus =
        applyStatusFilter === "all" || card.status.toLowerCase() === applyStatusFilter;

      return matchesSearch && matchesApplyStatus;
    };

    const sortCards = (cards: CandidateCard[]) => {
      const sortedCards = [...cards].sort((firstCard, secondCard) => firstCard.id - secondCard.id);
      return sortBy === "oldest" ? sortedCards : sortedCards.reverse();
    };

    const filteredCards = applybytitleMock.filter(matchesSearchAndFilter);

    return {
      newApplied: sortCards(filteredCards.filter((item) => item.section === "newApplied")),
      applied: sortCards(filteredCards.filter((item) => item.section === "applied")),
      interview: sortCards(filteredCards.filter((item) => item.section === "interview")),
      accept: sortCards(filteredCards.filter((item) => item.section === "accept")),
      reject: sortCards(filteredCards.filter((item) => item.section === "reject")),
    };
  }, [applyStatusFilter, searchQuery, sortBy]);

  useEffect(() => {
    setNewAppliedPage(1);
    setAppliedPage(1);
    setInterviewPage(1);
    setAcceptPage(1);
    setRejectPage(1);
  }, [applyStatusFilter, searchQuery, sortBy]);

  useEffect(() => {
    const newAppliedPages = Math.max(1, Math.ceil(sectionedCards.newApplied.length / perPageBySection.newApplied));
    const appliedPages = Math.max(1, Math.ceil(sectionedCards.applied.length / perPageBySection.applied));
    const interviewPages = Math.max(1, Math.ceil(sectionedCards.interview.length / perPageBySection.interview));
    const acceptPages = Math.max(1, Math.ceil(sectionedCards.accept.length / perPageBySection.accept));
    const rejectPages = Math.max(1, Math.ceil(sectionedCards.reject.length / perPageBySection.reject));

    if (newAppliedPage > newAppliedPages) {
      setNewAppliedPage(newAppliedPages);
    }

    if (appliedPage > appliedPages) {
      setAppliedPage(appliedPages);
    }

    if (interviewPage > interviewPages) {
      setInterviewPage(interviewPages);
    }

    if (acceptPage > acceptPages) {
      setAcceptPage(acceptPages);
    }

    if (rejectPage > rejectPages) {
      setRejectPage(rejectPages);
    }
  }, [
    acceptPage,
    appliedPage,
    interviewPage,
    newAppliedPage,
    rejectPage,
    sectionedCards.accept.length,
    sectionedCards.applied.length,
    sectionedCards.interview.length,
    sectionedCards.newApplied.length,
    sectionedCards.reject.length,
  ]);

  const getPageItems = <T,>(items: T[], page: number, perPage: number) => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  };

  const hasAnyResults =
    sectionedCards.newApplied.length > 0 ||
    sectionedCards.applied.length > 0 ||
    sectionedCards.interview.length > 0 ||
    sectionedCards.accept.length > 0 ||
    sectionedCards.reject.length > 0;

  const noResultReason = searchQuery.trim()
    ? `"${searchQuery.trim()}"`
    : applyStatusFilter !== "all"
      ? applyStatusFilter
      : "your criteria";

  const toggleStar = (cardId: number) => {
    setSelectedStars((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const handleOpenNewAppliedPopup = (card: CandidateCard) => {
    setSelectedNewAppliedCard(card);
    setIsNewAppliedPopupOpen(true);
  };

  const renderCard = (card: CandidateCard) => {
    const isStarSelected = Boolean(selectedStars[card.id]);
    const isGradient = card.highlightVariant === "gradient";
    const isInterview = card.status === "Interview";
    const isAccept = card.status === "Accept";
    const isReject = card.status === "Reject";
    const isNewApplied = card.section === "newApplied";

    const cardClass = isGradient
      ? "rounded-xl bg-card px-3 py-2 min-h-30"
      : isInterview
        ? "rounded-xl border status-interview-border status-interview-bg px-3 py-2 min-h-30"
        : isAccept
          ? "rounded-xl border status-accept-border status-accept-bg px-3 py-2 min-h-30"
          : "rounded-xl border border-border bg-card px-3 py-2 min-h-30";

    const cardStyle = isGradient
      ? {
          border: "1px solid transparent",
          backgroundImage:
            "linear-gradient(var(--card), var(--card)), var(--gradient-primary)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }
      : undefined;

    const statusClass =
      card.status === "Interview"
        ? "status-interview-text"
        : card.status === "Accept"
          ? "status-accept-text"
          : card.status === "Reject"
            ? "text-destructive"
            : "text-primary";

    const showMessage = card.status === "Interview" || card.status === "Accept";

    return (
      <article
        key={card.id}
        className={isNewApplied ? `${cardClass} cursor-pointer` : cardClass}
        style={cardStyle}
        role={isNewApplied ? "button" : undefined}
        tabIndex={isNewApplied ? 0 : undefined}
        onClick={isNewApplied ? () => handleOpenNewAppliedPopup(card) : undefined}
        onKeyDown={
          isNewApplied
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleOpenNewAppliedPopup(card);
                }
              }
            : undefined
        }
      >
        <div className="mb-1 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toggleStar(card.id);
              }}
              aria-label={isStarSelected ? "Unstar candidate" : "Star candidate"}
              className="rounded-sm"
            >
              <Star
                className={
                  isStarSelected
                    ? "size-3 fill-yellow-400 text-yellow-400"
                    : "size-3 text-foreground"
                }
              />
            </button>
            <span className="text-[11px] font-medium">{card.name}</span>
          </div>
          {card.viewed && <span className="text-muted-foreground text-[10px]">Viewed</span>}
        </div>

        <p className="text-[10px]">
          Status: <span className={statusClass}>{card.status}</span>
        </p>
        <p className="text-muted-foreground text-[10px]">{card.appliedAt}</p>

        <div className="mt-2 flex items-center justify-between gap-2">
          {isInterview ? (
            <Badge
              variant="outline"
              className="status-interview-bg rounded-full border-transparent text-[10px]"
            >
              <span className="status-interview-text">{card.skillMatch}</span>
            </Badge>
          ) : isAccept ? (
            <Badge
              variant="outline"
              className="status-accept-bg rounded-full border-transparent text-[10px]"
            >
              <span className="status-accept-text">{card.skillMatch}</span>
            </Badge>
          ) : isReject ? (
            <Badge
              variant="outline"
              className="status-reject-bg rounded-full border-transparent text-[10px]"
            >
              <span className="status-reject-text">{card.skillMatch}</span>
            </Badge>
          ) : (
            <Badge variant="gradient" className="rounded-full text-[10px]">
              <span className="gradient-text">{card.skillMatch}</span>
            </Badge>
          )}

          {showMessage ? (
            <Button
              variant="ghost"
              size="xs"
              className="from-primary to-secondary text-primary-foreground rounded-full bg-linear-to-r px-3"
            >
              Message
            </Button>
          ) : (
            <Button
              variant="outline"
              size="xs"
              className="rounded-full border-muted-foreground/30 bg-transparent text-muted-foreground hover:bg-transparent"
              onClick={
                isNewApplied
                  ? (event) => {
                      event.stopPropagation();
                      handleOpenNewAppliedPopup(card);
                    }
                  : undefined
              }
            >
              See Detail
            </Button>
          )}
        </div>
      </article>
    );
  };

  return (
    <PageLayout>
      <div className="w-full bg-background px-6 py-6 overflow-y-auto">
        <div className="mx-auto max-w-6xl ml-4">
          <div className="mb-6 mx-[1%]">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/applymonitor">Apply</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/applymonitor">Apply Monitor</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="truncate max-w-[50ch] align-bottom inline-block">
                    {decodedTitle}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-medium">{decodedTitle}</h1>
              <p className="text-[20px] font-normal">Status: <span className="text-primary">Active</span></p>
            </div>
            <Button
              variant="outline"
              size="xs"
              className="rounded-full border-muted-foreground/30 bg-transparent text-muted-foreground hover:bg-transparent"
              onClick={() => setIsJobDetailPopupOpen(true)}
            >
              View Job Detail
            </Button>
          </div>

          <section className="mb-4">
            <p className="mb-2 text-sm font-medium">Skill Use In This Job</p>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="xs"
                className="rounded-full bg-transparent hover:bg-transparent"
                style={gradientBorderStyle}
              >
                <span className="gradient-text">React</span>
              </Button>
              <Button
                variant="outline"
                size="xs"
                className="rounded-full bg-transparent hover:bg-transparent"
                style={gradientBorderStyle}
              >
                <span className="gradient-text">React</span>
              </Button>
            </div>
          </section>

          <section className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-10">
            <div className="md:col-span-4">
              <p className="text-foreground mb-1 text-base font-medium">Search</p>
              <Input
                placeholder="name"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <div className="md:col-span-3">
              <p className="text-foreground mb-1 text-base font-medium">Apply Status</p>
              <Select
                value={applyStatusFilter}
                onValueChange={(value) => setApplyStatusFilter(value as ApplyStatusFilter)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="placeholder" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="apply">Apply</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="accept">Accept</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <p className="text-foreground mb-1 text-base font-medium">Sort By</p>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as "newest" | "oldest")}>
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

          <div className="mb-3 flex flex-wrap gap-2">
            <Badge variant="gradient" className="rounded-full text-[12px] py-3">
              <span className="gradient-text">Match more 5 skills ✕</span>
            </Badge>
            <Badge variant="gradient" className="rounded-full text-[12px] py-3">
              <span className="gradient-text">Star only ✕</span>
            </Badge>
            <Badge variant="gradient" className="rounded-full text-[12px] py-3">
              <span className="gradient-text">Had experience to use skill in project ✕</span>
            </Badge>
            <ApplyByTitleFilterPopup
              open={isFilterPopupOpen}
              onOpenChange={setIsFilterPopupOpen}
            >
              <button
                type="button"
                onClick={() => setIsFilterPopupOpen(true)}
                className="group cursor-pointer mt-[-0.3%] rounded-full"
              >
                <Badge
                  variant="outline"
                  className={`rounded-full bg-transparent px-3 py-3 text-sm font-medium transition-all duration-200 ${
                    isFilterPopupOpen
                      ? "bg-linear-to-r from-primary/10 to-secondary/10"
                      : "group-hover:bg-linear-to-r group-hover:from-primary/10 group-hover:to-secondary/10"
                  }`}
                  style={gradientBorderStyle}
                >
                  <span className="gradient-text">+ New filter</span>
                </Badge>
              </button>
            </ApplyByTitleFilterPopup>
          </div>

          {hasAnyResults ? (
            <>
              {sectionedCards.newApplied.length > 0 && (
                <section className="mb-4">
                  <h2 className="text-sm font-semibold mb-2">New Applied</h2>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
                    {getPageItems(sectionedCards.newApplied, newAppliedPage, perPageBySection.newApplied).map(renderCard)}
                  </div>
                  <SectionPagination
                    total={sectionedCards.newApplied.length}
                    currentPage={newAppliedPage}
                    onPageChange={setNewAppliedPage}
                    perPage={perPageBySection.newApplied}
                    compact
                  />
                </section>
              )}

              {sectionedCards.applied.length > 0 && (
                <section className="mb-4">
                  <h2 className="text-sm font-semibold mb-2">Applied</h2>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
                    {getPageItems(sectionedCards.applied, appliedPage, perPageBySection.applied).map(renderCard)}
                  </div>
                  <SectionPagination
                    total={sectionedCards.applied.length}
                    currentPage={appliedPage}
                    onPageChange={setAppliedPage}
                    perPage={perPageBySection.applied}
                    compact
                  />
                </section>
              )}

              {sectionedCards.interview.length > 0 && (
                <section className="mb-4">
                  <h2 className="text-sm font-semibold mb-2">Interview</h2>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
                    {getPageItems(sectionedCards.interview, interviewPage, perPageBySection.interview).map(renderCard)}
                  </div>
                  <SectionPagination
                    total={sectionedCards.interview.length}
                    currentPage={interviewPage}
                    onPageChange={setInterviewPage}
                    perPage={perPageBySection.interview}
                    compact
                  />
                </section>
              )}

              {sectionedCards.accept.length > 0 && (
                <section className="mb-4">
                  <h2 className="text-sm font-semibold mb-2">Accept</h2>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
                    {getPageItems(sectionedCards.accept, acceptPage, perPageBySection.accept).map(renderCard)}
                  </div>
                  <SectionPagination
                    total={sectionedCards.accept.length}
                    currentPage={acceptPage}
                    onPageChange={setAcceptPage}
                    perPage={perPageBySection.accept}
                    compact
                  />
                </section>
              )}

              {sectionedCards.reject.length > 0 && (
                <section className="mb-4">
                  <h2 className="text-sm font-semibold mb-2">Reject</h2>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
                    {getPageItems(sectionedCards.reject, rejectPage, perPageBySection.reject).map(renderCard)}
                  </div>
                  <SectionPagination
                    total={sectionedCards.reject.length}
                    currentPage={rejectPage}
                    onPageChange={setRejectPage}
                    perPage={perPageBySection.reject}
                    compact
                  />
                </section>
              )}
            </>
          ) : (
            <div className="mb-6 rounded-xl border border-border bg-card px-4 py-6 text-center">
              <p className="text-base font-medium text-foreground">No result match {noResultReason}</p>
            </div>
          )}

          <ApplyByTitleJobDetailPopup
            open={isJobDetailPopupOpen}
            onOpenChange={setIsJobDetailPopupOpen}
            jobTitle={decodedTitle}
          />

          <ApplyByTitleNewAppliedPopup
            open={isNewAppliedPopupOpen}
            onOpenChange={setIsNewAppliedPopupOpen}
            card={selectedNewAppliedCard}
          />
        </div>
      </div>
    </PageLayout>
  );
}
