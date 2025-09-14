'use client';

import {
  Cross2Icon,
  DownloadIcon,
  ReloadIcon, // Import the new icon
} from '@radix-ui/react-icons';
import { type Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

import * as React from 'react';
import { exportToExcel } from '@/lib/export';
import { Transaction } from '@/types';
import { TFunction } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast'; // Import useToast

interface DataTableToolbarProps<TData extends Transaction> {
  table: Table<TData>;
  t: TFunction;
  recalculateFees: (transactions: TData[]) => Promise<boolean>; // Add this prop
}

export function DataTableToolbar<TData extends Transaction>({ table, t, recalculateFees }: DataTableToolbarProps<TData>) {
  const { toast } = useToast(); // Initialize toast
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isExporting, setIsExporting] = React.useState(false);
  const [isRecalculating, setIsRecalculating] = React.useState(false); // Add recalculating state
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

  // New handler for recalculating fees
  const handleRecalculate = async () => {
    setIsRecalculating(true);
    const filteredData = table.getFilteredRowModel().rows.map(row => row.original);
    
    const success = await recalculateFees(filteredData);

    if (success) {
      toast({
        title: t('recalculationSuccess'),
        description: `${filteredData.length} transactions have been updated.`
      });
    } else {
      toast({
        variant: 'destructive',
        title: t('recalculationError'),
        description: 'Please try again later.',
      });
    }
    setIsRecalculating(false);
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
        {/* New Recalculate Button */}
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={handleRecalculate}
          disabled={isRecalculating || table.getFilteredRowModel().rows.length === 0}
        >
          <ReloadIcon className="mr-2 h-4 w-4" />
          {isRecalculating ? t('recalculating') : t('recalculateFees')}
        </Button>

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
