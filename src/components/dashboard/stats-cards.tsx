'use client';

import { useContext, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppContext } from '@/contexts/app-context';
import { DollarSign, Hash, Users, Clock } from 'lucide-react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export function StatsCards() {
  const { transactions } = useContext(AppContext);

  const stats = useMemo(() => {
    const totalRevenue = transactions.reduce((acc, t) => acc + t.totalFee, 0);
    const totalTransactions = transactions.length;
    const morningShift = transactions.filter((t) => t.shift === 'Morning');
    const eveningShift = transactions.filter((t) => t.shift === 'Evening');

    const morningRevenue = morningShift.reduce(
      (acc, t) => acc + t.totalFee,
      0
    );
    const eveningRevenue = eveningShift.reduce(
      (acc, t) => acc + t.totalFee,
      0
    );

    return {
      totalRevenue,
      totalTransactions,
      morningCount: morningShift.length,
      eveningCount: eveningShift.length,
      morningRevenue,
      eveningRevenue,
    };
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value={`SAR ${stats.totalRevenue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
        icon={DollarSign}
        description="Total fees collected from all transactions"
      />
      <StatCard
        title="Total Transactions"
        value={stats.totalTransactions.toLocaleString()}
        icon={Hash}
        description="Total number of processed valet tickets"
      />
      <StatCard
        title="Morning Shift (8am-8pm)"
        value={`SAR ${stats.morningRevenue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
        icon={Clock}
        description={`${stats.morningCount} transactions`}
      />
      <StatCard
        title="Evening Shift (8pm-8am)"
        value={`SAR ${stats.eveningRevenue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
        icon={Users}
        description={`${stats.eveningCount} transactions`}
      />
    </div>
  );
}
