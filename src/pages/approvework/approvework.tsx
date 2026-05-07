import PageLayout from "@/components/layout/PageLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import SectionPagination from "@/components/ui/pagination";
import { useMemo, useState } from "react";
import type { ApproveWorkCard } from "@/types/approveWorkTypes";

const approveWorkCards: ApproveWorkCard[] = Array.from({ length: 230 }, (_, index) => ({
  id: index + 1,
  applicantName: "Chotanansub Sophaken",
  workTitle: "Personal Assistant 25 - 35 K (WFH 80%)",
  companyName: "อ่านพัฒนาการ ยิ้มอิฐนิภากรณ์บุกป่านิ่ง",
  period: "23 Mar 2026 - 31 Jul 2026",
}));

export default function ApproveWorkPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 15;

  const pagedCards = useMemo(() => {
    const start = (currentPage - 1) * cardsPerPage;
    return approveWorkCards.slice(start, start + cardsPerPage);
  }, [currentPage]);

  const gradientBorderStyle = {
    border: "1px solid transparent",
    backgroundImage:
      "linear-gradient(var(--card), var(--card)), var(--gradient-primary)",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
  } as const;

  return (
    <PageLayout>
      <div className="w-full overflow-y-auto bg-background px-6 py-6">
        <div className="mx-auto ml-4 max-w-6xl">
          <div className="mx-[1%] mb-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Employee</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Approve Work</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <h1 className="mt-[2%] text-4xl font-semibold text-foreground sm:text-3xl">Approve Work</h1>

          <section className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {pagedCards.map((card) => (
              <article
                key={card.id}
                className="flex min-h-32 flex-col rounded-xl border border-border bg-card px-4 py-3"
              >
                <h3 className="text-xl font-semibold leading-6">{card.applicantName}</h3>
                <p className="mt-1 text-sm text-muted-foreground">Work In: {card.workTitle}</p>
                <p className="text-sm text-muted-foreground">{card.companyName}</p>
                <p className="mt-1 text-sm text-foreground">Date: {card.period}</p>

                <div className="mt-auto flex justify-end pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    className="rounded-full border bg-transparent px-6 hover:bg-transparent"
                    style={gradientBorderStyle}
                  >
                    <span className="gradient-text">Approve This</span>
                  </Button>
                </div>
              </article>
            ))}
          </section>

          <SectionPagination
            total={approveWorkCards.length}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            perPage={cardsPerPage}
            compact
          />
        </div>
      </div>
    </PageLayout>
  );
}