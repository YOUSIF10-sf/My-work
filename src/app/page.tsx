'use client';

import { useContext } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, PageHeaderTitle } from '@/components/layout/page-header';
import { AppContext } from '@/contexts/app-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileUp, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { useTranslations } from '@/lib/i18n';

export default function DashboardPage() {
  const { transactions } = useContext(AppContext);
  const t = useTranslations();

  return (
    <AppShell>
      <PageHeader>
        <PageHeaderTitle>{t('dashboard')}</PageHeaderTitle>
      </PageHeader>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {transactions.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            <RevenueChart />
          </div>
        ) : (
          <div className="flex h-[60vh] items-center justify-center">
            <Alert className="max-w-xl text-center">
              <BarChart className="h-6 w-6 mx-auto mb-2" />
              <AlertTitle className="mb-2 text-xl font-bold">
                {t('welcomeToValetInsights')}
              </AlertTitle>
              <AlertDescription className="text-lg text-muted-foreground">
                {t('dashboardWelcomeMessage')}
                <div className="mt-4">
                  <Link href="/operations">
                    <Button>
                      <FileUp className="mr-2 h-4 w-4" />
                      {t('uploadFile')}
                    </Button>
                  </Link>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </AppShell>
  );
}
