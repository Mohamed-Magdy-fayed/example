import type { Table } from "@tanstack/react-table";

export function getSelectedRowIds(table: Table<unknown>): string[] {
    return Object.entries(table.getState().rowSelection)
        .filter(([, isSelected]) => Boolean(isSelected))
        .map(([rowId]) => rowId);
}

export function getSelectedRowCount(table: Table<unknown>): number {
    return getSelectedRowIds(table).length;
}