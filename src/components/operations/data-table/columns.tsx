'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Transaction } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { TFunction } from '@/lib/i18n';


// The `t` function is now passed as an argument with a specific type
export const columns = (t: TFunction): ColumnDef<Transaction>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={t('selectAll')}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={t('selectRow')}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'plateNo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('plateNo')} />
    ),
    filterFn: (row, id, value) => {
      if (Array.isArray(value)) {
        return value.includes(row.getValue(id));
      }
      return (row.getValue(id) as string).toLowerCase().includes((value as string).toLowerCase());
    },
  },
  {
    accessorKey: 'exitTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('exitTime')} />
    ),
    cell: ({ row }) => {
      return format(new Date(row.original.exitTime), 'PPpp');
    },
  },
  {
    accessorKey: 'exitGate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('exitGate')} />
    ),
  },
  {
    accessorKey: 'shift',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('shift')} />
    ),
    cell: ({ row }) => {
      const shift = row.original.shift;
      const badgeVariant = shift === 'Morning' ? 'default' : 'secondary';
      const badgeClass = shift === 'Morning' ? 'bg-amber-500' : 'bg-indigo-500';
      return <Badge variant={badgeVariant} className={badgeClass}>{t(shift.toLowerCase() as 'morning' | 'evening')}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'duration',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('durationHours')} />
    ),
    cell: ({ row }) => row.original.duration.toFixed(2),
  },
  {
    accessorKey: 'payType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('paymentType')} />
    ),
     filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'totalFee',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('totalFee')} />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalFee'));
      const formatted = new Intl.NumberFormat('ar-SA', { 
        style: 'currency',
        currency: 'SAR',
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
         const meta = table.options.meta as { updateTransaction: (transaction: Transaction) => void };
         return <DataTableRowActions row={row} updateTransaction={meta.updateTransaction} />;
    },
  },
];
