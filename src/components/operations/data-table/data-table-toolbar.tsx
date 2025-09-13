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
import { useTranslations } from '@/lib/i18n'; // استيراد hook الترجمة

interface DataTableToolbarProps<TData extends Transaction> {
  table: Table<TData>;
}

function ToolbarComponent<TData extends Transaction>({ table }: DataTableToolbarProps<TData>) {
  const { deleteTransactions, transactions, recalculateFeesForFilteredTransactions, loading } = useContext(AppContext);
  const { toast } = useToast();
  const t = useTranslations(); // استخدام الترجمات
  const [exporting, setExporting] = useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;
  
  const shifts = React.useMemo(() => [
    { value: '', label: t.all }, // ترجمة
    { value: 'Morning', label: t.morning }, // ترجمة
    { value: 'Evening', label: t.evening }, // ترجمة
  ], [t]);

  const payTypes = React.useMemo(() => {
    const types = new Set(transactions.map((t) => t.payType));
    return [{ value: '', label: t.all }, ...Array.from(types).map((type) => ({ value: type, label: type }))];
  }, [transactions, t]);

  const exitGates = React.useMemo(() => {
    const gates = new Set(transactions.map(t => t.exitGate));
    return [{ value: '', label: t.all }, ...Array.from(gates).map(gate => ({ value: gate, label: gate }))];
  }, [transactions, t]);


  const handleDeleteSelected = () => {
    const selectedIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => (row.original as Transaction).id);
    deleteTransactions(selectedIds);
    table.resetRowSelection();
    toast({
      description: t.transactionsDeleted(selectedIds.length), // ترجمة
    });
  };

  const handleApplyPricing = () => {
    const filteredData = table.getFilteredRowModel().rows.map(row => row.original as Transaction);
    recalculateFeesForFilteredTransactions(filteredData);
  }

  const handleExport = async () => {
     setExporting(true);
     toast({
      title: t.exportStartedTitle,
      description: t.exportStartedDescription,
    });

    try {
      const filteredData = table.getFilteredRowModel().rows.map(row => row.original as Transaction);
      
      if (filteredData.length === 0) {
        toast({
          variant: "destructive",
          title: t.exportFailedTitle,
          description: t.exportNoData,
        });
        setExporting(false);
        return;
      }
      
      const analysisResult = await analyzeValetData(filteredData);

      // Create a workbook
      const wb = XLSX.utils.book_new();
      const currencyFormat = `"${t.currency}" #,##0.00`;

      // --- Create Accountant's Summary Sheet ---
      const accountantData = [
        [t.accountantReportTitle],
        [],
        [t.accountantSummary],
        [analysisResult.accountantSummary],
        [],
        [t.keyFinancialMetrics],
        [t.metric, t.value],
        [t.totalRevenue, { t: 'n', v: analysisResult.totalRevenue, z: currencyFormat }],
        [t.totalTransactions, analysisResult.totalTransactions],
        [t.averageTransactionValue, { t: 'n', v: analysisResult.averageTransactionValue, z: currencyFormat }],
        [],
        [t.revenueByGate],
        [t.gate, t.revenue, t.transactions],
        ...Object.entries(analysisResult.revenueByGate).map(([gate, revenue]) => [
            gate,
            { t: 'n', v: revenue, z: currencyFormat },
            analysisResult.transactionsByGate[gate] || 0
        ]),
        [],
        [t.revenueByShift],
        [t.shift, t.revenue, t.transactions],
        ...Object.entries(analysisResult.revenueByShift).map(([shift, revenue]) => [
            shift,
            { t: 'n', v: revenue, z: currencyFormat },
            analysisResult.transactionsByShift[shift] || 0
        ]),
        [],
        [t.revenueByPayType],
        [t.type, t.revenue],
         ...Object.entries(analysisResult.revenueByPayType).map(([type, revenue]) => [
            type,
            { t: 'n', v: revenue, z: currencyFormat },
        ]),
      ];
      const wsAccountant = XLSX.utils.aoa_to_sheet(accountantData);
      wsAccountant['!cols'] = [{ wch: 40 }, { wch: 20 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, wsAccountant, t.accountantSummarySheet);

      // --- Create General Analysis Sheet ---
      const analysisData = [
        [t.generalReportTitle],
        [],
        [t.generalSummary],
        [analysisResult.summary],
        [],
        [t.keyMetrics],
        [t.metric, t.value],
        [t.totalRevenue, { t: 'n', v: analysisResult.totalRevenue, z: currencyFormat }],
        [t.totalTransactions, analysisResult.totalTransactions],
        [t.highestEarningGate, `${analysisResult.highestEarningGate.gate} (${new Intl.NumberFormat(t.locale, { style: 'currency', currency: t.currency }).format(analysisResult.highestEarningGate.revenue)})`],
        [t.busiestHour, `${analysisResult.peakHour.hour}:00 - ${analysisResult.peakHour.hour + 1}:00 (${analysisResult.peakHour.transactions} ${t.transactions}, ${new Intl.NumberFormat(t.locale, { style: 'currency', currency: t.currency }).format(analysisResult.peakHour.revenue)})`],
      ];
      const wsAnalysis = XLSX.utils.aoa_to_sheet(analysisData);
      wsAnalysis['!cols'] = [{ wch: 40 }, { wch: 40 }];
      XLSX.utils.book_append_sheet(wb, wsAnalysis, t.generalSummarySheet);

      // --- Create Detailed Transactions Sheet ---
      const transactionsForSheet = filteredData.map(t => ({
        [t.plateNumber]: t.plateNo,
        [t.exitTime]: t.exitTime,
        [t.exitGate]: t.exitGate,
        [t.shift]: t.shift,
        [t.durationHours]: t.duration,
        [t.payType]: t.payType,
        [t.parkingFee]: { t: 'n', v: t.parkingFee, z: currencyFormat },
        [t.valetFee]: { t: 'n', v: t.valetFee, z: currencyFormat },
        [t.totalFee]: { t: 'n', v: t.totalFee, z: currencyFormat },
      }));

      const wsTransactions = XLSX.utils.json_to_sheet(transactionsForSheet);
      wsTransactions['!cols'] = Array.from({ length: 9 }, () => ({ wch: 25 }));
      XLSX.utils.book_append_sheet(wb, wsTransactions, t.detailedTransactionsSheet);
      
      // --- Download the file ---
      XLSX.writeFile(wb, `${t.reportFileName}_${new Date().toISOString().split('T')[0]}.xlsx`);

      toast({
        title: t.exportCompleteTitle,
        description: t.exportCompleteDescription,
      });

    } catch (error: any) {
        console.error("Export failed", error);
        toast({
            variant: "destructive",
            title: t.exportFailedTitle,
            description: error.message || t.exportUnexpectedError,
        });
    } finally {
        setExporting(false);
    }
  };


  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={t.filterByPlate}
          value={(table.getColumn('plateNo')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('plateNo')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
         {table.getColumn('exitGate') && (
          <DataTableFacetedFilter
            column={table.getColumn('exitGate')}
            title={t.exitGate}
            options={exitGates}
          />
        )}
        {table.getColumn('shift') && (
          <DataTableFacetedFilter
            column={table.getColumn('shift')}
            title={t.shift}
            options={shifts}
          />
        )}
        {table.getColumn('payType') && (
          <DataTableFacetedFilter
            column={table.getColumn('payType')}
            title={t.payType}
            options={payTypes}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            {t.reset}
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
            {t.delete} ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        )}
        {table.getPreFilteredRowModel().rows.length > 0 && (
            <Button variant="outline" size="sm" className="h-8" onClick={handleApplyPricing} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DollarSign className="mr-2 h-4 w-4" />}
              {t.applyNewPricing}
            </Button>
        )}
        <Button variant="outline" size="sm" className="h-8" onClick={handleExport} disabled={exporting}>
          {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          {t.download}
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
export const DataTableToolbar = React.memo(ToolbarComponent);
