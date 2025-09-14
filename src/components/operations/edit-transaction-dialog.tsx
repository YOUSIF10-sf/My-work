'use client';

import { useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Save } from 'lucide-react';
import { format } from 'date-fns';
import { cn, determineShift } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { AppContext } from '@/contexts/app-context';
import type { Transaction } from '@/types';
import { calculateValetFees } from '@/ai/flows/calculate-valet-fees';
import { TFunction, useTranslations } from '@/lib/i18n'; // استيراد hook الترجمة

// تحديث السكيما برسائل مترجمة
const getEditTransactionSchema = (t: TFunction) => z.object({
  plateNo: z.string().min(1, t('plateNumberRequired')),
  exitTime: z.date({ required_error: t('exitTimeRequired') }),
  exitGate: z.string().min(1, t('exitGateRequired')),
  duration: z.coerce.number().min(0, t('durationPositive')),
  payType: z.string().min(1, t('paymentTypeRequired')),
});

type EditTransactionFormValues = z.infer<ReturnType<typeof getEditTransactionSchema>>;

interface EditTransactionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  transaction: Transaction;
  updateTransaction: (transaction: Transaction) => void;
}

export function EditTransactionDialog({
  isOpen,
  setIsOpen,
  transaction,
  updateTransaction,
}: EditTransactionDialogProps) {
  const { pricing } = useContext(AppContext);
  const { toast } = useToast();
  const t = useTranslations(); // استخدام الترجمات
  const editTransactionSchema = getEditTransactionSchema(t);

  const form = useForm<EditTransactionFormValues>({
    resolver: zodResolver(editTransactionSchema),
    defaultValues: {
      plateNo: transaction.plateNo,
      exitTime: new Date(transaction.exitTime),
      exitGate: transaction.exitGate,
      duration: transaction.duration,
      payType: transaction.payType,
    },
  });

  useEffect(() => {
    if (transaction) {
      form.reset({
        plateNo: transaction.plateNo,
        exitTime: new Date(transaction.exitTime),
        exitGate: transaction.exitGate,
        duration: transaction.duration,
        payType: transaction.payType,
      });
    }
  }, [transaction, form]);

  const onSubmit = async (data: EditTransactionFormValues) => {
    try {
      const gatePricing = pricing[data.exitGate] || pricing.default;
      const fees = await calculateValetFees({
        duration: data.duration,
        exitGate: data.exitGate,
        ...gatePricing,
      });

      const updatedTransaction: Transaction = {
        ...transaction,
        ...data,
        ...fees,
        shift: determineShift(data.exitTime),
      };

      updateTransaction(updatedTransaction);
      toast({
        title: t('success'),
        description: t('transactionUpdated'), // استخدام الترجمة
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to update transaction:', error);
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('transactionUpdateFailed'), // استخدام الترجمة
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('editTransaction')}</DialogTitle>
          <DialogDescription>
            {t('editTransactionDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="plateNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('plateNumber')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="exitGate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('exitGate')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="exitTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('exitTime')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP HH:mm:ss')
                          ) : (
                            <span>{t('pickDate')}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('durationHours')}</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="payType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('paymentType')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                {t('cancel')}
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {t('save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
