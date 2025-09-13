'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Transaction } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

// The `t` function is now passed as an argument
export const columns = (t: any): ColumnDef<Transaction>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={t.selectAll}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={t.selectRow}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'plateNo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.plateNumber} />
    ),
  },
  {
    accessorKey: 'exitTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.exitTime} />
    ),
    cell: ({ row }) => {
      return format(new Date(row.original.exitTime), 'PPpp');
    },
  },
  {
    accessorKey: 'exitGate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.exitGate} />
    ),
  },
  {
    accessorKey: 'shift',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.shift} />
    ),
    cell: ({ row }) => {
      const shift = row.original.shift;
      // Assuming shift can be 'Morning' or 'Evening'
      return <Badge variant={shift === 'Morning' ? 'default' : 'secondary'} className={shift === 'Morning' ? 'bg-amber-500' : 'bg-indigo-500'}>{t[shift.toLowerCase() as keyof typeof t]}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'duration',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.durationHours} />
    ),
    cell: ({ row }) => row.original.duration.toFixed(2),
  },
  {
    accessorKey: 'payType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.paymentType} />
    ),
     filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'totalFee',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.totalFee} />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalFee'));
      const formatted = new Intl.NumberFormat('ar-SA', { // Use arabic locale for currency
        style: 'currency',
        currency: 'SAR',
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => <DataTableRowActions row={row} updateTransaction={(table.options.meta as any)?.updateTransaction} />,
  },
];
