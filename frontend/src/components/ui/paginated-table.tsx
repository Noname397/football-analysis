import { useState, useEffect } from "react";
import { Button } from "./button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Loading from "@/app/instances/loading";

// Column definition interface
export interface ColumnDef<T> {
  key: string;
  header: string;
  width?: string;
  className?: string;
  sortable?: boolean;
  conditional?: boolean;
  render: (item: T) => React.ReactNode;
}

// Table configuration interface
export interface TableConfig<T> {
  columns: ColumnDef<T>[];
  emptyMessage?: string;
  rowClassName?: (item: T) => string;
  sortable?: boolean;
  defaultSort?: { column: string; direction: "asc" | "desc" };
}

// Main component props
export interface PaginatedTableProps<T> {
  config: TableConfig<T>;
  data: T[];
  totalCount: number;
  isLoading: boolean;
  isLoadingCount?: boolean;
  isError?: boolean;
  isErrorCount?: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onRowClick?: (item: T) => void;
  getItemKey: (item: T) => string | number;
}

export default function PaginatedTable<T>({
  config,
  data,
  totalCount,
  isLoading,
  isLoadingCount = false,
  isError = false,
  isErrorCount = false,
  page,
  pageSize,
  onPageChange,
  onRowClick,
  getItemKey,
}: PaginatedTableProps<T>) {
  const [pageInputValue, setPageInputValue] = useState<string>(`${page}`);
  const [pageInputError, setPageInputError] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Calculate total pages
  useEffect(() => {
    if (data && data.length > 0) {
      setTotalPages(Math.ceil((totalCount || 1) / pageSize));
    } else {
      setTotalPages(1);
    }
  }, [totalCount, pageSize, data]);

  // Handle page input validation
  useEffect(() => {
    if (!pageInputValue) {
      setPageInputError(true);
      return;
    }
    if (!/^\d+$/.test(pageInputValue)) {
      setPageInputError(true);
      return;
    }
    const pageNum = parseInt(pageInputValue);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
      setPageInputError(true);
      return;
    }

    setPageInputError(false);
  }, [pageInputValue, totalPages]);

  const handlePageNavigation = () => {
    if (pageInputError) return;
    onPageChange(parseInt(pageInputValue));
  };

  // Filter visible columns based on conditional property
  const visibleColumns = config.columns.filter(
    (column) => column.conditional === undefined || column.conditional === true
  );

  // Calculate colspan for empty message
  const colSpan = visibleColumns.length;

  return (
    <div className="py-3">
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  {visibleColumns.map((column) => (
                    <TableHead
                      key={column.key}
                      className={`${column.width || ""} ${
                        column.className || ""
                      }`}
                    >
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={colSpan}
                      className="py-4 text-center text-muted-foreground"
                    >
                      {config.emptyMessage || "No data found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item) => (
                    <TableRow
                      key={getItemKey(item)}
                      className={`cursor-pointer hover:bg-primary/5 ${
                        config.rowClassName ? config.rowClassName(item) : ""
                      }`}
                      onClick={() => onRowClick?.(item)}
                    >
                      {visibleColumns.map((column) => (
                        <TableCell
                          key={column.key}
                          className={column.className}
                        >
                          {column.render(item)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {!isLoadingCount && !isErrorCount && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing page {page} of {totalPages}
              </div>
              <div className="ml-2 flex items-center space-x-2">
                <input
                  type="text"
                  value={pageInputValue}
                  onChange={(e) => setPageInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePageNavigation()}
                  className={`h-8 w-14 rounded border px-2 text-center text-sm ${
                    pageInputError
                      ? "border-red-500 text-red-500"
                      : "border-input"
                  }`}
                  placeholder="Go to"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePageNavigation}
                  className="h-8"
                >
                  Go to page
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from(
                  {
                    length: Math.min(5, totalPages),
                  },
                  (_, i) => {
                    // Logic for showing relevant page numbers
                    let pageNum: number;

                    if (totalPages <= 5) {
                      // If 5 or fewer pages, show all page numbers
                      pageNum = i + 1;
                    } else {
                      // Show pages around current page
                      if (page <= 3) {
                        // Near start
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        // Near end
                        pageNum = totalPages - 4 + i;
                      } else {
                        // In the middle
                        pageNum = page - 2 + i;
                      }
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
