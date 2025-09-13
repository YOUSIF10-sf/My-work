'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Transaction } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export const columns: ColumnDef<Transaction>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'plateNo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plate No." />
    ),
  },
  {
    accessorKey: 'exitTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Exit Time" />
    ),
    cell: ({ row }) => {
      return format(row.original.exitTime, 'PPpp');
    },
  },
  {
    accessorKey: 'exitGate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Exit Gate" />
    ),
  },
  {
    accessorKey: 'shift',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Shift" />
    ),
    cell: ({ row }) => {
      const shift = row.original.shift;
      return <Badge variant={shift === 'Morning' ? 'default' : 'secondary'} className={shift === 'Morning' ? 'bg-amber-500' : 'bg-indigo-500'}>{shift}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'duration',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration (hrs)" />
    ),
    cell: ({ row }) => row.original.duration.toFixed(2),
  },
  {
    accessorKey: 'payType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pay Type" />
    ),
     filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'totalFee',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Fee" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalFee'));
      const formatted = new Intl.NumberFormat('en-US', {
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
