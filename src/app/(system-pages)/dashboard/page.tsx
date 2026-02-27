import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/components/data-table-skeleton";
import { TasksTableClient } from "@/features/tasks/components/tasks-table-client";
import { tasksTable } from "@/features/tasks/table";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function DashboardPage({ searchParams }: PageProps) {
  return (
    <main
      className="container mx-auto max-w-7xl space-y-6 p-4"
      id="tour-dashboard"
    >
      <Suspense
        fallback={<DataTableSkeleton columnCount={9} filterCount={6} />}
      >
        <TasksTableSection searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function TasksTableSection({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const result = await tasksTable.load(resolvedSearchParams);
  return <TasksTableClient {...result} />;
}
