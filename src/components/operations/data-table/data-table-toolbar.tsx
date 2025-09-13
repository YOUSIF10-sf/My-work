'use client';

import { useContext, useState } from 'react';
import type { Table } from '@tanstack/react-table';
import { X, Trash2, Download, Loader2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { AppContext } from '@/contexts/app-context';
import { useToast } from '@/hooks/use-toast';
import type { Transaction } from '@/types';
import React from 'react';
import { analyzeValetData } from '@/ai/flows/analyze-valet-data';
import * as XLSX from 'xlsx';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

function ToolbarComponent<TData>({ table }: DataTableToolbarProps<TData>) {
  const { deleteTransactions, transactions, recalculateFeesForFilteredTransactions, loading } = useContext(AppContext);
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;
  
  const shifts = React.useMemo(() => [
    { value: '', label: 'All' },
    { value: 'Morning', label: 'Morning' },
    { value: 'Evening', label: 'Evening' },
  ], []);

  const payTypes = React.useMemo(() => {
    const types = new Set(transactions.map((t) => t.payType));
    return [{ value: '', label: 'All' }, ...Array.from(types).map((type) => ({ value: type, label: type }))];
  }, [transactions]);

  const exitGates = React.useMemo(() => {
    const gates = new Set(transactions.map(t => t.exitGate));
    return [{ value: '', label: 'All' }, ...Array.from(gates).map(gate => ({ value: gate, label: gate }))];
  }, [transactions]);


  const handleDeleteSelected = () => {
    const selectedIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => (row.original as Transaction).id);
    deleteTransactions(selectedIds);
    table.resetRowSelection();
    toast({
      description: `${selectedIds.length} transaction(s) deleted.`,
    });
  };

  const handleApplyPricing = () => {
    const filteredData = table.getFilteredRowModel().rows.map(row => row.original as Transaction);
    recalculateFeesForFilteredTransactions(filteredData);
  }

  const handleExport = async () => {
     setExporting(true);
     toast({
      title: "Export Started",
      description: "Generating your data analysis report...",
    });

    try {
      const filteredData = table.getFilteredRowModel().rows.map(row => row.original as Transaction);
      
      if (filteredData.length === 0) {
        toast({
          variant: "destructive",
          title: "Export Failed",
          description: "No data to export.",
        });
        setExporting(false);
        return;
      }
      
      const analysisResult = await analyzeValetData(filteredData);

      // Create a workbook
      const wb = XLSX.utils.book_new();
      const currencyFormat = '"SAR" #,##0.00';

      // --- Create Accountant's Summary Sheet ---
      const accountantData = [
        ["Valet Insights - Accountant's Report"],
        [],
        ["Accountant's Summary"],
        [analysisResult.accountantSummary],
        [],
        ["Key Financial Metrics"],
        ["Metric", "Value"],
        ["Total Revenue", { t: 'n', v: analysisResult.totalRevenue, z: currencyFormat }],
        ["Total Transactions", analysisResult.totalTransactions],
        ["Average Transaction Value", { t: 'n', v: analysisResult.averageTransactionValue, z: currencyFormat }],
        [],
        ["Revenue by Gate"],
        ["Gate", "Revenue", "Transactions"],
        ...Object.entries(analysisResult.revenueByGate).map(([gate, revenue]) => [
            gate,
            { t: 'n', v: revenue, z: currencyFormat },
            analysisResult.transactionsByGate[gate] || 0
        ]),
        [],
        ["Revenue by Shift"],
        ["Shift", "Revenue", "Transactions"],
        ...Object.entries(analysisResult.revenueByShift).map(([shift, revenue]) => [
            shift,
            { t: 'n', v: revenue, z: currencyFormat },
            analysisResult.transactionsByShift[shift] || 0
        ]),
        [],
        ["Revenue by Payment Type"],
        ["Type", "Revenue"],
         ...Object.entries(analysisResult.revenueByPayType).map(([type, revenue]) => [
            type,
            { t: 'n', v: revenue, z: currencyFormat },
        ]),
      ];
      const wsAccountant = XLSX.utils.aoa_to_sheet(accountantData);
      wsAccountant['!cols'] = [{ wch: 40 }, { wch: 20 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, wsAccountant, "Accountant's Summary");

      // --- Create General Analysis Sheet ---
      const analysisData = [
        ["Valet Insights - General Report"],
        [],
        ["General Summary"],
        [analysisResult.summary],
        [],
        ["Key Metrics"],
        ["Metric", "Value"],
        ["Total Revenue", { t: 'n', v: analysisResult.totalRevenue, z: currencyFormat }],
        ["Total Transactions", analysisResult.totalTransactions],
        ["Highest Earning Gate", `${analysisResult.highestEarningGate.gate} (${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR' }).format(analysisResult.highestEarningGate.revenue)})`],
        ["Busiest Hour", `${analysisResult.peakHour.hour}:00 - ${analysisResult.peakHour.hour + 1}:00 (${analysisResult.peakHour.transactions} txns, ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR' }).format(analysisResult.peakHour.revenue)})`],
      ];
      const wsAnalysis = XLSX.utils.aoa_to_sheet(analysisData);
      wsAnalysis['!cols'] = [{ wch: 40 }, { wch: 40 }];
      XLSX.utils.book_append_sheet(wb, wsAnalysis, "General Summary");

      // --- Create Detailed Transactions Sheet ---
      const transactionsForSheet = filteredData.map(t => ({
        'Plate No.': t.plateNo,
        'Exit Time': t.exitTime,
        'Exit Gate': t.exitGate,
        'Shift': t.shift,
        'Duration (hrs)': t.duration,
        'Pay Type': t.payType,
        'Parking Fee': { t: 'n', v: t.parkingFee, z: currencyFormat },
        'Valet Fee': { t: 'n', v: t.valetFee, z: currencyFormat },
        'Total Fee': { t: 'n', v: t.totalFee, z: currencyFormat },
      }));

      const wsTransactions = XLSX.utils.json_to_sheet(transactionsForSheet);
      wsTransactions['!cols'] = Array.from({ length: 9 }, () => ({ wch: 25 }));
      XLSX.utils.book_append_sheet(wb, wsTransactions, "Detailed Transactions");
      
      // --- Download the file ---
      XLSX.writeFile(wb, `Valet_Insights_Report_${new Date().toISOString().split('T')[0]}.xlsx`);

      toast({
        title: "Export Complete",
        description: "Your report has been downloaded.",
      });

    } catch (error: any) {
        console.error("Export failed", error);
        toast({
            variant: "destructive",
            title: "Export Failed",
            description: error.message || "An unexpected error occurred while generating the report.",
        });
    } finally {
        setExporting(false);
    }
  };


  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by plate number..."
          value={(table.getColumn('plateNo')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('plateNo')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
         {table.getColumn('exitGate') && (
          <DataTableFacetedFilter
            column={table.getColumn('exitGate')}
            title="Exit Gate"
            options={exitGates}
          />
        )}
        {table.getColumn('shift') && (
          <DataTableFacetedFilter
            column={table.getColumn('shift')}
            title="Shift"
            options={shifts}
          />
        )}
        {table.getColumn('payType') && (
          <DataTableFacetedFilter
            column={table.getColumn('payType')}
            title="Pay Type"
            options={payTypes}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            className="h-8"
            onClick={handleDeleteSelected}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        )}
        {table.getPreFilteredRowModel().rows.length > 0 && (
            <Button variant="outline" size="sm" className="h-8" onClick={handleApplyPricing} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DollarSign className="mr-2 h-4 w-4" />}
              Apply New Pricing
            </Button>
        )}
        <Button variant="outline" size="sm" className="h-8" onClick={handleExport} disabled={exporting}>
          {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Download
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
export const DataTableToolbar = React.memo(ToolbarComponent);

    