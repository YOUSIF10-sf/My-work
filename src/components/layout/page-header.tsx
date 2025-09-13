import { cn } from '@/lib/utils';
import type React from 'react';

function PageHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        'flex items-center justify-between gap-4 border-b bg-card px-4 py-4 sm:px-6 lg:px-8',
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

function PageHeaderTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'font-headline text-2xl font-semibold tracking-tight text-foreground',
        className
      )}
      {...props}
    />
  );
}

function PageHeaderActions({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-shrink-0 items-center justify-end gap-2',
        className
      )}
      {...props}
    />
  );
}

export { PageHeader, PageHeaderTitle, PageHeaderActions };
