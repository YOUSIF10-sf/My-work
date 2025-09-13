'use client';

import { MoreHorizontal } from 'lucide-react';
import type { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useContext, useState } from 'react';
import { AppContext } from '@/contexts/app-context';
import type { Transaction } from '@/types';
import { EditTransactionDialog } from '../edit-transaction-dialog';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  updateTransaction: (transaction: Transaction) => void;
}

export function DataTableRowActions<TData>({
  row,
  updateTransaction
}: DataTableRowActionsProps<TData>) {
  const { deleteTransactions } = useContext(AppContext);
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const transaction = row.original as Transaction;

  const handleDelete = () => {
    deleteTransactions([transaction.id]);
    toast({
      description: 'Transaction deleted.',
    });
  };
  
  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleMakeCopy = () => {
    toast({
      title: "Feature not available",
      description: "Copying transactions is not yet implemented."
    });
  };

  return (
    <>
    <EditTransactionDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        transaction={transaction}
        updateTransaction={updateTransaction}
      />
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleMakeCopy}>Make a copy</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  );
}
