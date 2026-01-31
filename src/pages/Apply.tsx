import PageLayout from "@/components/layout/PageLayout";

export default function ApplyPage() {
  return (
    <PageLayout>
      <div className="bg-background h-full w-full py-6 px-4">
        <h1 className="text-3xl font-medium">Apply Monitor</h1>
        <p className="mt-4 text-sm text-muted-foreground">This is the Apply Monitor page. Sidebar is included via PageLayout.</p>
      </div>
    </PageLayout>
  );
}
