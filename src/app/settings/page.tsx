'use client';

import { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppContext, type PricingState } from '@/contexts/app-context';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, PageHeaderTitle } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import Link from 'next/link';

const pricingSchema = z.object({
  hourlyRate: z.coerce.number().min(0, 'Hourly rate must be a positive number.'),
  dailyRate: z.coerce.number().min(0, 'Daily rate must be a positive number.'),
  valetFee: z.coerce.number().min(0, 'Valet fee must be a positive number.'),
});

type PricingFormValues = z.infer<typeof pricingSchema>;

const DEFAULT_PRICING: PricingState = {
  hourlyRate: 35,
  dailyRate: 210,
  valetFee: 50,
};

export default function SettingsPage() {
  const { transactions, pricing, updatePricing } = useContext(AppContext);
  const [selectedGate, setSelectedGate] = useState<string>('default');

  const uniqueGates = [
    'default',
    ...Array.from(new Set(transactions.map((t) => t.exitGate))),
  ];

  const form = useForm<PricingFormValues>({
    resolver: zodResolver(pricingSchema),
    defaultValues: pricing['default'] ?? DEFAULT_PRICING,
  });

  useEffect(() => {
    const currentPricing = pricing[selectedGate] ?? pricing['default'] ?? DEFAULT_PRICING;
    form.reset(currentPricing);
  }, [selectedGate, pricing, form]);

  const onSubmit = (data: PricingFormValues) => {
    updatePricing(selectedGate, data);
  };

  const handleGateChange = (gate: string) => {
    setSelectedGate(gate);
  };

  return (
    <AppShell>
      <PageHeader>
        <PageHeaderTitle>Pricing Settings</PageHeaderTitle>
      </PageHeader>
      <div className="container mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>How to Apply Pricing Changes</AlertTitle>
          <AlertDescription>
            Updating prices here will save the new configuration. To apply these changes to transactions, go to the{' '}
            <Link href="/operations" className="font-semibold underline">
              Operations page
            </Link>
            , filter the desired transactions, and use the &quot;Apply New Pricing&quot; button.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Manage Pricing by Gate</CardTitle>
            <CardDescription>
              Select a gate to configure its specific pricing. The default
              settings apply to any gate without custom pricing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormItem>
                  <FormLabel>Select Gate to Configure</FormLabel>
                  <Select onValueChange={handleGateChange} value={selectedGate}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a gate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {uniqueGates.map((gate) => (
                        <SelectItem key={gate} value={gate}>
                          {gate === 'default' ? 'Default Pricing' : gate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose a gate to set or edit its pricing.
                  </FormDescription>
                </FormItem>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="hourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hourly Rate (SAR)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 35"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          For stays up to 6 hours.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dailyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily Rate (SAR)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 210"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          For stays exceeding 6 hours.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="valetFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valet Service Fee (SAR)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 50"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Fixed fee applied to transactions for this gate.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Pricing Configuration
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
