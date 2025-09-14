'use client';

import {
  Cross2Icon,
  DownloadIcon,
} from '@radix-ui/react-icons';
import { type Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

import * as React from 'react';
import { exportToExcel } from '@/lib/export'; // Make sure this path is correct
import { Transaction } from '@/types';
import { TFunction } from '@/lib/i18n';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  t: TFunction;
}

export function DataTableToolbar<TData extends Transaction>({ table, t }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isExporting, setIsExporting] = React.useState(false);
  const [showOnlyDuplicates, setShowOnlyDuplicates] = React.useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const visibleData = table.getFilteredRowModel().rows.map(row => row.original);
      await exportToExcel(visibleData, t);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  React.useEffect(() => {
    if (showOnlyDuplicates) {
      const plateCounts = table.getCoreRowModel().rows.reduce((acc, row) => {
        const plateNo = (row.original as Transaction).plateNo;
        acc[plateNo] = (acc[plateNo] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const duplicates = Object.entries(plateCounts).filter(([, count]) => count > 1).map(([plateNo]) => plateNo);
      table.setColumnFilters(prev => [...prev.filter(f => f.id !== 'plateNo'), { id: 'plateNo', value: duplicates }]);
    } else {
      table.setColumnFilters(prev => prev.filter(f => f.id !== 'plateNo'));
    }
  }, [showOnlyDuplicates, table]);

  const uniqueExitGates = React.useMemo(() => {
    const exitGates = new Set<string>();
    table.getCoreRowModel().rows.forEach(row => {
        const transaction = row.original as Transaction;
        if (transaction.exitGate) {
            exitGates.add(transaction.exitGate);
        }
    });
    return Array.from(exitGates).map(gate => ({
        label: gate,
        value: gate,
    }));
  }, [table]);
  
  const shiftOptions = [
    { label: t('morning'), value: 'Morning' },
    { label: t('evening'), value: 'Evening' },
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={t('filterByPlate')}
          value={(table.getColumn('plateNo')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('plateNo')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('exitGate') && (
          <DataTableFacetedFilter
            column={table.getColumn('exitGate')}
            title={t('exitGate')}
            options={uniqueExitGates}
          />
        )}
        {table.getColumn('shift') && (
          <DataTableFacetedFilter
            column={table.getColumn('shift')}
            title={t('shift')}
            options={shiftOptions}
          />
        )}
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => setShowOnlyDuplicates(!showOnlyDuplicates)}
        >
          {showOnlyDuplicates ? t('reset') : t('showDuplicates')}
        </Button>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => { table.resetColumnFilters(); setShowOnlyDuplicates(false); }}
            className="h-8 px-2 lg:px-3"
          >
            {t('reset')}
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={handleExport}
          disabled={isExporting}
        >
          <DownloadIcon className="mr-2 h-4 w-4" />
          {isExporting ? t('loading') : t('download')}
        </Button>
        <DataTableViewOptions table={table} t={t} />
      </div>
    </div>
  );
}
