'use client';

import { useContext } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, PageHeaderTitle } from '@/components/layout/page-header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { AppContext } from '@/contexts/app-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileUp, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/i18n';

export default function DashboardPage() {
  const { transactions } = useContext(AppContext);
  const t = useTranslations();

  return (
    <AppShell>
      <PageHeader>
        <PageHeaderTitle>{t.dashboard}</PageHeaderTitle>
      </PageHeader>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {transactions.length > 0 ? (
          <div className="grid gap-6">
            <StatsCards />
            <RevenueChart />
          </div>
        ) : (
          <div className="flex h-[60vh] items-center justify-center">
            <Alert className="max-w-xl text-center border-dashed">
              <BarChart2 className="mx-auto h-8 w-8 text-muted-foreground" />
              <AlertTitle className="mt-4 text-xl font-headline">
                {t.welcomeToValetInsights}
              </AlertTitle>
              <AlertDescription className="mt-2 text-muted-foreground">
                {t.dashboardWelcomeMessage}
              </AlertDescription>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/operations">
                    <FileUp className="mr-2 h-4 w-4" />
                    {t.goToOperations}
                  </Link>
                </Button>
              </div>
            </Alert>
          </div>
        )}
      </div>
    </AppShell>
  );
}
