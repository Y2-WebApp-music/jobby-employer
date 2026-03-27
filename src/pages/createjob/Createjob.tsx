import PageLayout from "@/components/layout/PageLayout"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { DatePicker } from "@/components/ui/datepicker"
import RtfQuill from "@/components/ui/rtf-quill"
import Toggle from "@/components/ui/toggle"
import IoTrashBin from "@/assets/icons/IoTrashBin.png"
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react"
import { Link } from "react-router-dom"

type AddressAutoFillOption = {
  postalCode: string
  addressLine: string
  no: string
  moo: string
  soi: string
  street: string
  province: string
  district: string
  subDistrict: string
}

const mockAddressOptions: AddressAutoFillOption[] = [
  {
    postalCode: "10110",
    addressLine: "Khlong Toei Area",
    no: "20",
    moo: "3",
    soi: "Soi Sukhumvit 4",
    street: "Sukhumvit Road",
    province: "Bangkok",
    district: "Khlong Toei",
    subDistrict: "Khlong Toei",
  },
  {
    postalCode: "10111",
    addressLine: "Khlong Toei Area",
    no: "20",
    moo: "3",
    soi: "Soi Sukhumvit 4",
    street: "Sukhumvit Road",
    province: "Bangkok",
    district: "Khlong Toei",
    subDistrict: "Khlong Toei Nuea",
  },
]

export default function CreatejobPage() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [jobDescription, setJobDescription] = useState<string>("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [selectedFileType, setSelectedFileType] = useState<string>("")
  const [selectedPostalCode, setSelectedPostalCode] = useState<string>("")

  const gradientBorderStyle = {
    borderColor: "transparent",
    backgroundImage: "linear-gradient(var(--background), var(--background)), var(--gradient-primary)",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
  }

  const gradientTextStyle = {
    backgroundImage: "var(--gradient-primary)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  }

  const selectedAddress =
    mockAddressOptions.find((address) => address.postalCode === selectedPostalCode) || null

  const getAcceptedExtensions = (fileType: string): string => {
    const typeMap: Record<string, string> = {
      pdf: ".pdf",
      txt: ".txt",
      jpeg: ".jpeg,.jpg",
      png: ".png",
    }
    return typeMap[fileType] || ""
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(files)])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const triggerFileInput = () => {
    const input = document.getElementById("file-upload") as HTMLInputElement
    input?.click()
  }

  return (
    <PageLayout>
      <div className="w-full bg-background px-6 py-6">
        {/* Container */}
        <div className="mx-auto my-[-0%] max-w-6xl ml-4">
          {/* Breadcrumb */}
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
                  <BreadcrumbPage>Create Job</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-medium mt-[3%] ml-[-1%]">Create Job</h1>

          {/* Basic Information */}
          <section className="mt-[1%]">
            <h2 className="mb-4  text-lg font-medium gradient-text inline-block">
              Basic Information
            </h2>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-10">
              <div className="md:col-span-6">
                <label className="text-sm  dark:text-accent">
                  Job name
                </label>
                <Input placeholder="Personal Assistant 25 - 35 K (WFH 80%)" />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm dark:text-accent">
                  Work Option
                </label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />

                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="onsite">Onsite</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm dark:text-accent">
                  Open To
                </label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />

                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyone">Everyone</SelectItem>
                    <SelectItem value="experienced">Experienced Only</SelectItem>
                    <SelectItem value="fresh-graduate">Fresh Graduates</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm dark:text-accent">
                  Work Category
                </label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />

                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="software-development">Software Development</SelectItem>
                    <SelectItem value="web-development">Web Development</SelectItem>
                    <SelectItem value="mobile-development">Mobile Development</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                    <SelectItem value="graphic-design">Graphic Design</SelectItem>
                    <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                    <SelectItem value="content-writing">Content Writing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="customer-service">Customer Service</SelectItem>
                    <SelectItem value="human-resources">Human Resources</SelectItem>
                    <SelectItem value="accounting">Accounting</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="project-management">Project Management</SelectItem>
                    <SelectItem value="business-analyst">Business Analyst</SelectItem>
                    <SelectItem value="quality-assurance">Quality Assurance</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                    <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="administrative">Administrative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

                <div className="md:col-span-2">
                <label className="text-sm dark:text-accent">
                  Start Apply
                </label>
                <DatePicker
                  date={startDate}
                  onDateChange={setStartDate}
                  pairedDate={endDate}
                  type="start"
                  placeholder="Pick a date"
                />
                </div>

                <div className="md:col-span-2">
                <label className="text-sm dark:text-accent">
                  End Apply
                </label>
                <DatePicker
                  date={endDate}
                  onDateChange={setEndDate}
                  pairedDate={startDate}
                  type="end"
                  placeholder="Pick a date"
                />
                </div>
            </div>
          </section>

          {/*  Address Information  */}
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-medium">
              Address Information
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
              <div className="md:col-span-3">
                <label className="text-sm dark:text-accent">
                  Address line
                </label>
                <Input value={selectedAddress?.addressLine || ""} placeholder="Auto fill from backend" readOnly />
              </div>

              <div>
                <label className="text-sm text-foreground dark:text-accent">No.</label>
                <Input value={selectedAddress?.no || ""} placeholder="Auto fill from backend" readOnly />
              </div>

              <div>
                <label className="text-sm text-foreground dark:text-accent">Moo</label>
                <Input value={selectedAddress?.moo || ""} placeholder="Auto fill from backend" readOnly />
              </div>

              <div>
                <label className="text-sm text-foreground dark:text-accent">Soi</label>
                <Input value={selectedAddress?.soi || ""} placeholder="Auto fill from backend" readOnly />
              </div>

              <div>
                <label className="text-sm text-foreground dark:text-accent">Street</label>
                <Input value={selectedAddress?.street || ""} placeholder="Auto fill from backend" readOnly />
              </div>

              <div>
                <label className="text-sm text-foreground dark:text-accent">Province</label>
                <Input value={selectedAddress?.province || ""} placeholder="Auto fill from backend" readOnly />
              </div>

              <div>
                <label className="text-sm text-foreground dark:text-accent">District</label>
                <Input value={selectedAddress?.district || ""} placeholder="Auto fill from backend" readOnly />
              </div>

              <div>
                <label className="text-sm text-foreground dark:text-accent">Sub-district</label>
                <Input value={selectedAddress?.subDistrict || ""} placeholder="Auto fill from backend" readOnly />
              </div>

              <div>
                <label className="text-sm text-foreground dark:text-accent">
                  Postal code
                </label>
                <Select value={selectedPostalCode} onValueChange={setSelectedPostalCode}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select postal code" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAddressOptions.map((address) => (
                      <SelectItem key={address.postalCode} value={address.postalCode}>
                        {address.postalCode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Address fields are prepared for backend auto-fill. Postal code can have multiple options per area.
            </p>
          </section>

          {/* ===== Skills ===== */}
          <section className="mt-10">
            <h2 className="mb-3 text-lg font-semibold">Skill Use</h2>

            <div className="flex flex-wrap gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full border bg-transparent hover:bg-transparent"
                style={gradientBorderStyle}
              >
                <span style={gradientTextStyle}>Button</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full border bg-transparent hover:bg-transparent"
                style={gradientBorderStyle}
              >
                <span style={gradientTextStyle}>React</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full border bg-transparent hover:bg-transparent"
                style={gradientBorderStyle}
              >
                <span style={gradientTextStyle}>Typescript</span>
              </Button>

              <Button
                variant="default"
                size="sm"
                className="rounded-full text-white "
                style={{ background: "var(--gradient-primary)" }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Skill
              </Button>
            </div>
          </section>

          {/*  Job Description  */}
          <section className="mt-10">
            <h2 className="mb-3 text-lg font-semibold">
              Job Description
            </h2>

            <RtfQuill
              value={jobDescription}
              onChange={setJobDescription}
              className="min-h-56 w-full rounded-md border bg-background"
            />
          </section>

          {/* ===== Profile Need ===== */}
          <section className="mt-10">
            <h2 className="mb-3 text-lg font-medium gradient-text inline-block">Profile Need</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm">
                <Toggle />
                Cover letter
              </label>
              <label className="flex items-center gap-3 text-sm">
                <Toggle />
                Work Experience
              </label>
              <label className="flex items-center gap-3 text-sm">
                <Toggle />
                Education
              </label>
            </div>
          </section>

          {/* ===== Addition Question ===== */}
          <section className="mt-10">
            <h2 className="mb-3 text-lg font-medium gradient-text inline-block">Addition Question</h2>

            <div className="space-y-4">
              {/* Card: Open Answer */}
              <div className="rounded-xl border bg-background p-4 shadow-sm">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Type: Open Answer</span>
                  <div className="flex items-center gap-3">
                    <button className="hover:text-foreground inline-flex items-center gap-1">
                      <ChevronUp className="h-5 w-5" />
                      Move Up
                    </button>
                    <button className="hover:text-foreground inline-flex items-center gap-1">
                      <ChevronDown className="h-5 w-5" />
                      Move Down
                    </button>
                    <button className="hover:text-foreground inline-flex items-center gap-1" aria-label="Delete">
                      <img src={IoTrashBin} alt="Delete" className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-sm dark:text-accent">Question</label>
                  <Input placeholder="Personal Assistant 25 - 35 K (WFH 80%) ย่านพัฒนาการ ยินดีรับนักศึกษาจบใหม่" />
                </div>
              </div>

              {/* Card: Radio Answer */}
              <div className="rounded-xl border bg-background p-4 shadow-sm">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Type: Radio Answer</span>
                  <div className="flex items-center gap-3">
                    <button className="hover:text-foreground inline-flex items-center gap-1">
                      <ChevronUp className="h-5 w-5" />
                      Move Up
                    </button>
                    <button className="hover:text-foreground inline-flex items-center gap-1">
                      <ChevronDown className="h-5 w-5" />
                      Move Down
                    </button>
                    <button className="hover:text-foreground inline-flex items-center gap-1" aria-label="Delete">
                      <img src={IoTrashBin} alt="Delete" className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-3">
                  <div>
                    <label className="text-sm dark:text-accent">Question</label>
                    <Input placeholder="Personal Assistant 25 - 35 K (WFH 80%) ย่านพัฒนาการ ยินดีรับนักศึกษาจบใหม่" />
                  </div>

                  <div>
                    <label className="text-sm dark:text-accent">Answer</label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">≡</span>
                        <Input placeholder="Personal Assistant 25 - 35 K (WFH 80%) ย่านพัฒนาการ ยินดีรับนักศึกษาจบใหม่" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">≡</span>
                        <Input placeholder="Personal Assistant 25 - 35 K (WFH 80%) ย่านพัฒนาการ ยินดีรับนักศึกษาจบใหม่" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">≡</span>
                        <Input placeholder="Personal Assistant 25 - 35 K (WFH 80%) ย่านพัฒนาการ ยินดีรับนักศึกษาจบใหม่" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">≡</span>
                        <Input placeholder="Personal Assistant 25 - 35 K (WFH 80%) ย่านพัฒนาการ ยินดีรับนักศึกษาจบใหม่" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">≡</span>
                        <Input placeholder="Personal Assistant 25 - 35 K (WFH 80%) ย่านพัฒนาการ ยินดีรับนักศึกษาจบใหม่" />
                      </div>
                    </div>

                    <div className="mt-3 flex justify-center">
                      <Button variant="ghost" size="sm" className="rounded-full border border-muted-foreground text-muted-foreground hover:bg-muted">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Answer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card: Checkbox Answer */}
              <div className="rounded-xl border bg-background p-4 shadow-sm">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Type: Checkbox Answer</span>
                  <div className="flex items-center gap-3">
                    <button className="hover:text-foreground inline-flex items-center gap-1">
                      <ChevronUp className="h-5 w-5" />
                      Move Up
                    </button>
                    <button className="hover:text-foreground inline-flex items-center gap-1">
                      <ChevronDown className="h-5 w-5" />
                      Move Down
                    </button>
                    <button className="hover:text-foreground inline-flex items-center gap-1" aria-label="Delete">
                      <img src={IoTrashBin} alt="Delete" className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-3">
                  <div>
                    <label className="text-sm dark:text-accent">Question</label>
                    <Input placeholder="Personal Assistant 25 - 35 K (WFH 80%) ย่านพัฒนาการ ยินดีรับนักศึกษาจบใหม่" />
                  </div>

                  <div>
                    <label className="text-sm dark:text-accent">Answer</label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">≡</span>
                        <Input placeholder="Personal Assistant 25 - 35 K (WFH 80%) ย่านพัฒนาการ ยินดีรับนักศึกษาจบใหม่" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">≡</span>
                        <Input placeholder="Personal Assistant 25 - 35 K (WFH 80%) ย่านพัฒนาการ ยินดีรับนักศึกษาจบใหม่" />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <Button variant="ghost" size="sm" className="rounded-full border border-muted-foreground text-muted-foreground hover:bg-muted">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Answer
                      </Button>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Can Select Up To</span>
                        <Select defaultValue="3">
                          <SelectTrigger className="w-16 h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-4">
                <Button variant="ghost" size="sm" className="rounded-full border border-muted-foreground text-muted-foreground hover:bg-muted">
                  <Plus className="h-4 w-4 mr-1" />
                  Text Answer
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full border border-muted-foreground text-muted-foreground hover:bg-muted">
                  <Plus className="h-4 w-4 mr-1" />
                  Radio
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full border border-muted-foreground text-muted-foreground hover:bg-muted">
                  <Plus className="h-4 w-4 mr-1" />
                  Checkbox
                </Button>
              </div>
            </div>
          </section>

          {/* ===== Addition File ===== */}
          <section className="mt-10">
            <h2 className="mb-3 text-lg font-semibold gradient-text inline-block">Addition File</h2>

            <div className="rounded-lg border p-4 w-3/5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="text-sm dark:text-accent">Label</label>
                  <Input placeholder="Text here" />
                </div>
                <div>
                  <label className="text-sm dark:text-accent">File Type</label>
                  <Select value={selectedFileType} onValueChange={setSelectedFileType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="txt">txt</SelectItem>
                      <SelectItem value="jpeg">jpeg</SelectItem>
                      <SelectItem value="png">png</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-3">
                <label className="text-sm dark:text-accent">Description</label>
                <Input placeholder="Type your message here" />
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <input
                id="file-upload"
                type="file"
                multiple
                accept={getAcceptedExtensions(selectedFileType)}
                onChange={handleFileSelect}
                className="hidden"
              />
              {uploadedFiles.length > 0 ? (
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="rounded-full border border-muted-foreground text-muted-foreground hover:bg-muted w-full justify-start"
                    >
                      <span className="flex-1 truncate text-left">{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="ml-2 hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Button>
                  ))}
                </div>
              ) : null}
              <Button
                variant="ghost"
                size="sm"
                onClick={triggerFileInput}
                disabled={!selectedFileType}
                className="rounded-full border border-muted-foreground text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4 mr-1" />
                File
              </Button>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  )
}
