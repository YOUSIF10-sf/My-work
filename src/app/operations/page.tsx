'use client';

import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, PageHeaderTitle } from '@/components/layout/page-header';
import { DataTable } from '@/components/operations/data-table/data-table';
import { columns } from '@/components/operations/data-table/columns';
import { FileUploader } from '@/components/operations/file-uploader';
import { AppContext } from '@/contexts/app-context';
import { useContext, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { useTranslations } from '@/lib/i18n';

function DataTableSkeleton() {
  const t = useTranslations();
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
      <div className="flex items-center justify-center pt-4 text-muted-foreground">
        <p>{t('loading')}...</p>
      </div>
    </div>
  )
}

export default function OperationsPage() {
  const { transactions, loading, updateTransaction } = useContext(AppContext);
  const t = useTranslations();
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
        <PageHeaderTitle>{t('operations')}</PageHeaderTitle>
      </PageHeader>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading && transactions.length === 0 ? (
           <DataTableSkeleton />
        ) : transactions.length > 0 ? (
          <DataTable columns={columns(t)} data={transactions} updateTransaction={updateTransaction} {...stateProps} />
        ) : (
           <div className="flex h-[60vh] items-center justify-center">
                <FileUploader />
            </div>
        )}
      </div>
    </AppShell>
  );
}
