'use client';

import { useContext, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { AppContext } from '@/contexts/app-context';
import type { ChartConfig } from '@/components/ui/chart';

export function RevenueChart() {
  const { transactions } = useContext(AppContext);

  const chartData = useMemo(() => {
    const revenueByGate: { [key: string]: number } = {};
    transactions.forEach((t) => {
      if (!revenueByGate[t.exitGate]) {
        revenueByGate[t.exitGate] = 0;
      }
      revenueByGate[t.exitGate] += t.totalFee;
    });

    return Object.entries(revenueByGate)
      .map(([gate, revenue]) => ({ gate, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [transactions]);
  
  const chartConfig = {
    revenue: {
      label: 'Revenue (SAR)',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig;


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Revenue by Exit Gate</CardTitle>
        <CardDescription>
          Analysis of total revenue generated from each exit gate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="gate"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(value) => `SAR ${value}`}
              width={80}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent
                formatter={(value) => `SAR ${Number(value).toLocaleString()}`}
                indicator="dot" 
              />}
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
