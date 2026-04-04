import { Suspense } from "react";

import { DataTableSkeleton } from "@/components/data-table/components/data-table-skeleton";
import { UsersTableClient } from "@/features/users/components/users-table-client";
import { usersTable } from "@/features/users/table";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function EmployeePage({ searchParams }: PageProps) {
  return (
    <div
      className="container mx-auto flex min-h-0 max-w-7xl flex-1 flex-col space-y-6 overflow-hidden p-4"
      id="tour-dashboard"
    >
      <Suspense
        fallback={<DataTableSkeleton columnCount={9} filterCount={6} />}
      >
        <UsersTableSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function UsersTableSection({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const result = await usersTable.load(resolvedSearchParams);
  return <UsersTableClient {...result} />;
}
