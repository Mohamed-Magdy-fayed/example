"use client";

import type { ColumnDef, Table } from "@tanstack/react-table";
import { Text } from "lucide-react";
import { useCallback, useMemo } from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useDataTable } from "@/components/data-table/hooks/use-data-table";
import { getSelectedRowCount } from "@/components/data-table/lib/selection";
import { ActionBar } from "@/components/ui/action-bar";
import { type User, userRoleValues } from "@/drizzle/schema";

export default function Page() {
    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                id: "name",
                accessorKey: "name",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} label="Name" />
                ),
                cell: ({ row }) => <div>{row.getValue("name")}</div>,
                meta: {
                    label: "Name",
                    placeholder: "Search names...",
                    variant: "text",
                    icon: Text,
                },
                enableColumnFilter: true,
            },
            {
                id: "role",
                accessorKey: "role",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} label="Role" />
                ),
                meta: {
                    label: "Role",
                    variant: "select",
                    options: userRoleValues.map((role) => ({ label: role, value: role })),
                },
                enableColumnFilter: true,
            },
        ],
        [],
    );

    const { table } = useDataTable({
        data: [],
        columns,
        pageCount: 0,
        initialState: {
            sorting: [{ id: "createdAt", desc: true }],
            pagination: { pageSize: 10, pageIndex: 0 },
        },
        getRowId: (row) => row.id,
    });

    return (
        <DataTable actionBar={<TableActionBar table={table} />} table={table}>
            {/* <DataTableAdvancedToolbar table={table}>
                <DataTableFilterList table={table} />
                <DataTableSortList table={table} />
                </DataTableAdvancedToolbar> */}
        </DataTable>
    );
}

function TableActionBar({ table }: { table: Table<User> }) {
    const selectedRowsCount = getSelectedRowCount(table as Table<unknown>);

    const onOpenChange = useCallback(
        (open: boolean) => {
            if (!open) {
                table.resetRowSelection(true);
            }
        },
        [table],
    );

    return (
        <ActionBar onOpenChange={onOpenChange} open={selectedRowsCount > 0}>
            {/* Add your custom actions here */}
        </ActionBar>
    );
}
