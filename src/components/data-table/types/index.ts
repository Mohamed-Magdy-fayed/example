import type { ColumnDef, ColumnSort, Row, RowData } from "@tanstack/react-table";
import type { DataTableConfig } from "@/components/data-table/config";
import type { FilterItemSchema } from "@/components/data-table/lib/parsers";
import type { DateRangePreset } from "@/lib/date-range";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    queryKeys?: QueryKeys;
    totalsByColumnId?: Partial<Record<string, number>>;
  }

  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
    placeholder?: string;
    variant?: FilterVariant;
    options?: Option[];
    range?: [number, number];
    unit?: string;
    sumFormatter?: (value: number) => React.ReactNode;
    datePresets?: DateRangePreset[];
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  }
}

export interface QueryKeys {
  page: string;
  perPage: string;
  sort: string;
  filters: string;
  joinOperator: string;
}

export interface Option<TValue extends string = string> {
  label: string;
  value: TValue;
  count?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export type StringKeyOf<T> = Extract<keyof T, string>;

export type DataTableFilterValue = string | string[] | null;

export type DataTableFilterMap = Record<string, DataTableFilterValue>;

export interface DataTablePaginationState {
  page: number;
  perPage: number;
}

export interface DataTableQuery<TFilters = DataTableFilterMap, TData = unknown> {
  pagination: DataTablePaginationState;
  sorting: ExtendedColumnSort<TData>[];
  filters: TFilters;
  searchParams?: URLSearchParams;
}

export type DataTableFeatures = Record<string, boolean | undefined>;

export interface DataTableColumnsContext<TCounts = Record<string, unknown>> {
  counts?: Partial<TCounts>;
  features?: DataTableFeatures;
}

export type DataTableColumnsFactory<
  TData,
  TCounts = Record<string, unknown>,
> =
  | ColumnDef<TData, unknown>[]
  | ((context: DataTableColumnsContext<TCounts>) => ColumnDef<TData, unknown>[]);

export interface DataTableFetchResult<
  TData,
  TMeta = Record<string, unknown>,
> {
  rows: TData[];
  total?: number;
  pageCount?: number;
  meta?: TMeta;
}

export type DataTableFetcher<
  TData,
  TFilters = DataTableFilterMap,
  TMeta = Record<string, unknown>,
> = (query: DataTableQuery<TFilters, TData>) => Promise<DataTableFetchResult<TData, TMeta>>;

export interface DataTableFilterDefinition {
  id: string;
  key?: string;
  variant?: FilterVariant;
  expectsArray?: boolean;
  separator?: string;
  parse?: (value: DataTableFilterValue) => DataTableFilterValue;
}

export type DataTableCountFetcherMap<
  TFilters,
  TCounts,
  TData,
> = {
    [K in keyof TCounts]: (query: DataTableQuery<TFilters, TData>) => Promise<TCounts[K]>;
  };

export interface DataTableInitialState<TData> {
  sorting?: ExtendedColumnSort<TData>[];
  pagination?: {
    pageSize: number;
    pageIndex: number;
  };
  columnVisibility?: Record<string, boolean>;
}

export type FilterOperator = DataTableConfig["operators"][number];
export type FilterVariant = DataTableConfig["filterVariants"][number];
export type JoinOperator = DataTableConfig["joinOperators"][number];

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: Extract<keyof TData, string>;
}

export interface ExtendedColumnFilter<TData> extends FilterItemSchema {
  id: Extract<keyof TData, string>;
}

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  variant: "update" | "delete";
}
