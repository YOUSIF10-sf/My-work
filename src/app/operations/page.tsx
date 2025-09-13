'use client';

import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, PageHeaderTitle, PageHeaderActions } from '@/components/layout/page-header';
import { DataTable } from '@/components/operations/data-table/data-table';
import { columns } from '@/components/operations/data-table/columns';
import { FileUploader } from '@/components/operations/file-uploader';
import { AppContext } from '@/contexts/app-context';
import { useContext, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Transaction } from '@/types';
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
} from '@tanstack/react-table';

function DataTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="rounded-md border">
        <div className="divide-y divide-border">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center p-4 space-x-4">
              <Skeleton className="h-5 w-5 rounded-sm" />
              <Skeleton className="h-5 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function OperationsPage() {
  const { transactions, loading, updateTransaction } = useContext(AppContext);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const stateProps = {
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  };


  return (
    <AppShell>
      <PageHeader>
        <PageHeaderTitle>Operations</PageHeaderTitle>
        <PageHeaderActions>
          <FileUploader />
        </PageHeaderActions>
      </PageHeader>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading && transactions.length === 0 ? (
           <DataTableSkeleton />
        ) : transactions.length > 0 ? (
          <DataTable<Transaction, any> columns={columns} data={transactions} updateTransaction={updateTransaction} {...stateProps} />
        ) : (
          <div className="flex h-[60vh] items-center justify-center">
            <Alert className="max-w-xl text-center border-dashed">
              <FileUp className="mx-auto h-8 w-8 text-muted-foreground" />
              <AlertTitle className="mt-4 text-xl font-headline">
                No Operations Data
              </AlertTitle>
              <AlertDescription className="mt-2 text-muted-foreground">
                Upload an Excel file to begin processing and analyzing your valet transactions.
              </AlertDescription>
               <div className="mt-6">
                <FileUploader isButton />
              </div>
            </Alert>
          </div>
        )}
      </div>
    </AppShell>
  );
}
