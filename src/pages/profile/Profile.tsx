import PageLayout from "@/components/layout/PageLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { CompanyProfileDetails } from "@/types/domain/profile";
import { useState } from "react";
import { Pencil } from "lucide-react";
import ProfileAboutPopup from "./ProfileAboutPopup";
import ProfileCompanyInformationPopup from "./ProfileCompanyInformationPopup";
import ProfileCompanyNamePopup from "./ProfileCompanyNamePopup";
import ProfileCompanyProfilePicturePopup from "./ProfileCompanyProfilePicturePopup";
import OpenJobCard from "./OpenJobCard";

const initialCompanyProfile: CompanyProfileDetails = {
  companyName: "Company name",
  place: "Bangkok",
  region: "Thailand",
  phone: "+66624311671",
  email: "kungyu.159@gmail.com",
  address: "Lat Krabang, Bangkok, Thailand",
  mediaLinks: [
    { label: "linkedin", url: "https://www.linkedin.com" },
    { label: "github", url: "https://www.github.com" },
    { label: "facebook", url: "https://www.facebook.com" },
    { label: "Instagram", url: "https://www.instagram.com" },
  ],
};

const initialAboutText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam neque nunc, vestibulum rutrum ornare vitae, sollicitudin non lacus. Donec eget ultrices ante. Aenean in sem nulla. Proin sit amet libero sit amet libero hendrerit ornare. Suspendisse sed eros at justo bibendum euismod sit amet nec tellus. Maecenas tincidunt nisi pharetra eros semper finibus. Aliquam mattis ipsum sem, elementum venenatis leo faucibus a.";

const initialCompanyInformationHtml = `
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id lorem sit amet purus convallis accumsan nec porttitor libero. Integer id neque nibh. Ut cursus nunc vitae erat vulputate venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam dictum nibh vitae ipsum convallis dapibus.</p>
  <p><strong>Headline</strong></p>
  <p>Suspendisse potenti. Quisque at neque ut eros elementum suscipit. Vivamus et elit a tortor lobortis pretium sit amet vitae eros. Donec sit amet tortor blandit, aliquam nisi ac, aliquet arcu. Sed eget diam scelerisque augue.</p>
  <p><strong>&quot;Headline&quot;</strong></p>
  <p>Suspendisse potenti. Quisque at neque ut eros elementum suscipit. Vivamus et elit a tortor lobortis pretium sit amet vitae eros. Donec sit amet tortor blandit, aliquam nisi ac, aliquet arcu.</p>
`;

const jobCards = Array.from({ length: 6 }).map((_, index) => ({
  id: index + 1,
  title:
    "Personal Assistant 25 - 35 K (WFH 80%) ตำแหน่งงานการปฏิบัติงานที่สำนักงานใหญ่",
  location: "Lat Krabang, Bangkok",
  dateRange: "25 Nov 2025 - 30 Jan 2026",
  applied: "1123 Applied",
}));

export default function ProfilePage() {
  const [companyProfile, setCompanyProfile] = useState(initialCompanyProfile);
  const [companyProfileImageUrl, setCompanyProfileImageUrl] = useState("");
  const [isCompanyNamePopupOpen, setIsCompanyNamePopupOpen] = useState(false);
  const [
    isCompanyProfilePicturePopupOpen,
    setIsCompanyProfilePicturePopupOpen,
  ] = useState(false);
  const [aboutText, setAboutText] = useState(initialAboutText);
  const [isAboutPopupOpen, setIsAboutPopupOpen] = useState(false);
  const [companyInformationHtml, setCompanyInformationHtml] = useState(
    initialCompanyInformationHtml,
  );
  const [isCompanyInformationPopupOpen, setIsCompanyInformationPopupOpen] =
    useState(false);

  const profileTags = [
    companyProfile.email,
    companyProfile.phone,
    ...companyProfile.mediaLinks.map((link) => link.label || link.url),
  ].filter((tag) => tag.trim().length > 0);

  const locationText = [companyProfile.place, companyProfile.region]
    .filter((item) => item.trim().length > 0)
    .join(", ");

  return (
    <PageLayout>
      <div className="w-full overflow-y-auto bg-background px-6 py-6">
        <div className="mx-auto ml-4 max-w-6xl">
          <div className="mb-3 mx-[1%]">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Profile</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Main Profile</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <section className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="relative h-44 overflow-hidden bg-[#4a555d]">
              <div className="absolute -left-8 -top-10 size-28 rounded-full bg-[#d93fd0]" />
              <div className="bg-linear-to-br absolute left-24 top-20 size-36 rounded-full from-[#ff8557] to-[#ea39d9]" />
              <div className="bg-linear-to-br absolute left-1/2 -top-9 size-32 -translate-x-1/2 rounded-full from-[#ff9800] to-[#e23be0]" />
              <div className="absolute -right-6 top-6 size-36 rounded-full bg-[#ff9800]" />
              <div className="absolute left-1/3 top-3 size-7 rounded-full bg-white/90" />
              <div className="absolute right-20 top-12 size-10 rounded-full bg-white/90" />
            </div>

            <div className="relative px-6 pb-6 pt-22">
              <div className="absolute -top-20 left-6 size-40 rounded-full border-4 border-card bg-[#c8ccd2] shadow-sm">
                {companyProfileImageUrl ? (
                  <img
                    src={companyProfileImageUrl}
                    alt={companyProfile.companyName}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : null}
                <button
                  type="button"
                  aria-label="Edit company profile picture"
                  onClick={() => setIsCompanyProfilePicturePopupOpen(true)}
                  className="absolute bottom-1 right-1 rounded-full border border-border bg-background p-1.5 text-muted-foreground shadow-sm transition-colors hover:bg-muted"
                >
                  <Pencil className="size-3.5" />
                </button>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-semibold">
                      {companyProfile.companyName}
                    </h1>
                    <button
                      type="button"
                      aria-label="Edit company name"
                      onClick={() => setIsCompanyNamePopupOpen(true)}
                      className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                    >
                      <Pencil className="size-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {locationText}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {profileTags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-border bg-background px-4 py-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">About</h2>
                    <button
                      type="button"
                      aria-label="Edit about"
                      onClick={() => setIsAboutPopupOpen(true)}
                      className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                    >
                      <Pencil className="size-4" />
                    </button>
                  </div>
                  <p className="text-sm leading-6 whitespace-pre-line wrap-break-word text-muted-foreground">
                    {aboutText}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-background px-4 py-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      Company Information
                    </h2>
                    <button
                      type="button"
                      aria-label="Edit company information"
                      onClick={() => setIsCompanyInformationPopupOpen(true)}
                      className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                    >
                      <Pencil className="size-4" />
                    </button>
                  </div>
                  <div
                    className="text-sm leading-6 text-muted-foreground [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-0 [&_p+ol]:mt-3 [&_p+ul]:mt-3 [&_p:not(:first-child)]:mt-3 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5"
                    dangerouslySetInnerHTML={{ __html: companyInformationHtml }}
                  />
                </div>

                <div className="rounded-xl border border-border bg-background px-4 py-3">
                  <h2 className="mb-3 text-lg font-semibold">Open Job</h2>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    {jobCards.map((job) => (
                      <OpenJobCard
                        key={job.id}
                        title={job.title}
                        location={job.location}
                        dateRange={job.dateRange}
                        applied={job.applied}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ProfileAboutPopup
        open={isAboutPopupOpen}
        value={aboutText}
        onOpenChange={setIsAboutPopupOpen}
        onSave={(nextValue) => {
          setAboutText(nextValue);
          setIsAboutPopupOpen(false);
        }}
      />

      <ProfileCompanyInformationPopup
        open={isCompanyInformationPopupOpen}
        value={companyInformationHtml}
        onOpenChange={setIsCompanyInformationPopupOpen}
        onSave={(nextValue) => {
          setCompanyInformationHtml(nextValue);
          setIsCompanyInformationPopupOpen(false);
        }}
      />

      <ProfileCompanyNamePopup
        open={isCompanyNamePopupOpen}
        value={companyProfile}
        onOpenChange={setIsCompanyNamePopupOpen}
        onSave={(nextValue) => {
          setCompanyProfile(nextValue);
          setIsCompanyNamePopupOpen(false);
        }}
      />

      <ProfileCompanyProfilePicturePopup
        open={isCompanyProfilePicturePopupOpen}
        value={companyProfileImageUrl}
        companyName={companyProfile.companyName}
        onOpenChange={setIsCompanyProfilePicturePopupOpen}
        onSave={(nextValue) => {
          setCompanyProfileImageUrl(nextValue);
          setIsCompanyProfilePicturePopupOpen(false);
        }}
      />
    </PageLayout>
  );
}
