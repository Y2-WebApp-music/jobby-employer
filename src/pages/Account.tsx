import PageLayout from "@/components/layout/PageLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
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
import { accountManagementMock } from "@/mock/accountManagementMock";
import { Ellipsis, Plus } from "lucide-react";
import { useMemo, useState } from "react";

export default function AccountPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 15;

  const roleOptions = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set(accountManagementMock.map((account) => account.role)),
      ),
    ],
    [],
  );

  const filteredAccounts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const matched = accountManagementMock.filter((account) => {
      const isNameMatched = account.name
        .toLowerCase()
        .includes(normalizedQuery);
      const isRoleMatched =
        selectedRole === "all" || account.role === selectedRole;
      return isNameMatched && isRoleMatched;
    });

    return [...matched].sort((first, second) => {
      if (sortBy === "name-desc") {
        return second.name.localeCompare(first.name);
      }

      if (sortBy === "newest") {
        return second.id - first.id;
      }

      return first.name.localeCompare(second.name);
    });
  }, [searchQuery, selectedRole, sortBy]);

  const pagedAccounts = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredAccounts.slice(start, start + perPage);
  }, [currentPage, filteredAccounts]);

  return (
    <PageLayout>
      <div className="w-full bg-background px-6 py-6 overflow-y-auto">
        <div className="mx-auto max-w-6xl ml-4">
          <div className="mb-3 mx-[1%]">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Employee</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Account Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="mb-4 mt-2 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-4xl font-semibold text-foreground sm:text-2xl">
              Account Management
            </h1>
            <Button size="lg" className="px-5">
              <Plus className="size-4" />
              Add People
            </Button>
          </div>

          <section className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-12">
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

            <div className="md:col-span-3">
              <p className="mb-1 text-base font-medium">Filter</p>
              <Select
                value={selectedRole}
                onValueChange={(value) => {
                  setSelectedRole(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role === "all" ? "All" : role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3">
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
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-left">
                    <th className="px-5 py-3 font-semibold">ID</th>
                    <th className="px-5 py-3 font-semibold">name</th>
                    <th className="px-5 py-3 font-semibold">email</th>
                    <th className="px-5 py-3 font-semibold">Role</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {pagedAccounts.map((account) => (
                    <tr
                      key={account.id}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="px-5 py-3">{account.employeeId}</td>
                      <td className="px-5 py-3">{account.name}</td>
                      <td className="px-5 py-3">{account.email}</td>
                      <td className="px-5 py-3">{account.role}</td>
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                          aria-label={`Open actions for ${account.name}`}
                        >
                          <Ellipsis className="size-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <SectionPagination
            total={filteredAccounts.length}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            perPage={perPage}
          />
        </div>
      </div>
    </PageLayout>
  );
}
