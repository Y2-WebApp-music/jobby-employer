import PageLayout from "@/components/layout/PageLayout";

export default function AccountPage() {
  return (
    <PageLayout>
      <div className="bg-background h-full w-full py-6 px-4">
        <h1 className="text-3xl font-medium">Account Management</h1>
        <p className="mt-4 text-sm text-muted-foreground">This is the Account Management page. Sidebar is included via PageLayout.</p>
      </div>
    </PageLayout>
  );
}
