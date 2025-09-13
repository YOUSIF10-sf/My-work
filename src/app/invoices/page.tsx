
'use client';

// استيراد المكتبات والمكونات اللازمة
import { useContext, useMemo } from 'react';
import { AppContext } from '@/contexts/app-context';
import { AppShell } from '@/components/layout/app-shell';
import {
  PageHeader,
  PageHeaderTitle,
  PageHeaderActions,
} from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileDown, Printer, ChevronDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';

// استيراد المكتبات اللازمة لتصدير الملفات
import { Packer, Document, Paragraph, TextRun, Table as DocxTable, TableCell as DocxTableCell, TableRow as DocxTableRow, HeadingLevel, AlignmentType, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { FileText } from 'lucide-react';


// تعريف نوع البيانات لهيكل الفاتورة الملخصة
interface InvoiceSummary {
  gate: string;
  revenue: number;
  transactionCount: number;
}

// دالة لتهيئة وتنسيق العملة (الريال السعودي)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
  }).format(amount);
};

export default function InvoicesPage() {
  const { transactions } = useContext(AppContext);

  // حساب بيانات الفاتورة وتجميعها
  const { invoiceData, totalRevenue, totalTransactions } = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { invoiceData: [], totalRevenue: 0, totalTransactions: 0 };
    }

    const summary: { [gate: string]: { revenue: number; count: number } } = {};
    transactions.forEach((transaction) => {
      if (!summary[transaction.exitGate]) {
        summary[transaction.exitGate] = { revenue: 0, count: 0 };
      }
      summary[transaction.exitGate].revenue += transaction.totalFee;
      summary[transaction.exitGate].count += 1;
    });

    const invoiceData: InvoiceSummary[] = Object.entries(summary)
      .map(([gate, data]) => ({
        gate,
        revenue: data.revenue,
        transactionCount: data.count,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const totalRevenue = invoiceData.reduce((acc, item) => acc + item.revenue, 0);
    const totalTransactions = invoiceData.reduce(
      (acc, item) => acc + item.transactionCount,
      0
    );

    return { invoiceData, totalRevenue, totalTransactions };
  }, [transactions]);


  const handlePrint = () => {
    window.print();
  };

  // دالة لتنزيل الفاتورة بصيغة Word
  const handleDownloadWord = () => {
    const tableRows = [
        new DocxTableRow({
            children: [
                new DocxTableCell({
                    children: [new Paragraph({ text: "إجمالي الإيرادات", heading: HeadingLevel.HEADING_5, alignment: AlignmentType.LEFT })],
                    borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "000000" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" } },
                }),
                new DocxTableCell({
                    children: [new Paragraph({ text: "عدد العمليات", heading: HeadingLevel.HEADING_5, alignment: AlignmentType.CENTER })],
                    borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "000000" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" } },
                }),
                new DocxTableCell({
                    children: [new Paragraph({ text: "الموقع (بوابة الخروج)", heading: HeadingLevel.HEADING_5, alignment: AlignmentType.RIGHT })],
                    borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "000000" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" } },
                }),
            ],
        }),
      ...invoiceData.map(
        (item) =>
          new DocxTableRow({
            children: [
              new DocxTableCell({ children: [new Paragraph({ text: formatCurrency(item.revenue), alignment: AlignmentType.LEFT })] }),
              new DocxTableCell({ children: [new Paragraph({ text: String(item.transactionCount), alignment: AlignmentType.CENTER })] }),
              new DocxTableCell({ children: [new Paragraph({ text: item.gate, alignment: AlignmentType.RIGHT })] }),
            ],
          })
      ),
      new DocxTableRow({
        children: [
          new DocxTableCell({ children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: formatCurrency(totalRevenue), bold: true })] })] }),
          new DocxTableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(totalTransactions), bold: true })] })] }),
          new DocxTableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'المجموع الإجمالي', bold: true })] })] }),
        ],
      }),
    ];

    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 720,
                            right: 720,
                            bottom: 720,
                            left: 720,
                        },
                    },
                },
                children: [
                    new Paragraph({ text: 'فاتورة الإيرادات الإجمالية', heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: `تاريخ الإنشاء: ${new Date().toLocaleDateString('ar-SA')}`, alignment: AlignmentType.CENTER, style: 'WellSpaced' }),
                    new Paragraph({ text: ' ' }), // فراغ
                    new DocxTable({
                        rows: tableRows,
                        width: { size: 100, type: WidthType.PERCENTAGE },
                    }),
                ],
            },
        ],
        styles: {
            paragraphStyles: [{
                id: "WellSpaced",
                name: "Well Spaced",
                basedOn: "Normal",
                quickFormat: true,
                paragraph: {
                    spacing: { after: 200 },
                },
            }]
        }
    });


    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, 'Valet-Invoice-Summary.docx');
    });
  };

  return (
    <AppShell>
      <PageHeader className="print-hide">
        <PageHeaderTitle>ملخص الفواتير</PageHeaderTitle>
        <PageHeaderActions>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={transactions.length === 0}>
                تحميل / طباعة
                <ChevronDown className="w-4 h-4 mr-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handlePrint}>
                <Printer className="w-4 h-4 ml-2" />
                طباعة / حفظ كـ PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadWord}>
                <FileDown className="w-4 h-4 ml-2" />
                تنزيل كـ Word
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </PageHeaderActions>
      </PageHeader>
      <div className="container px-4 py-8 mx-auto sm:px-6 lg:px-8 print-container">
        {transactions.length > 0 ? (
          <Card className="bg-card print-card" id="invoice-summary">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">
                فاتورة الإيرادات الإجمالية
              </CardTitle>
              <CardDescription>
                ملخص للإيرادات وعدد العمليات لكل موقع بناءً على البيانات
                المفلترة الحالية.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">
                      الموقع (بوابة الخروج)
                    </TableHead>
                    <TableHead className="text-center">عدد العمليات</TableHead>
                    <TableHead className="text-right">إجمالي الإيرادات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceData.map((item) => (
                    <TableRow key={item.gate}>
                      <TableCell className="font-medium text-right">
                        {item.gate}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.transactionCount}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(item.revenue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="bg-muted/50 hover:bg-muted">
                    <TableHead className="text-right font-bold">
                      المجموع الإجمالي
                    </TableHead>
                    <TableHead className="text-center font-bold">
                      {totalTransactions}
                    </TableHead>
                    <TableHead className="text-right font-bold font-mono">
                      {formatCurrency(totalRevenue)}
                    </TableHead>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
             <CardFooter className="justify-end p-6 print-hide">
              <p className="text-sm text-muted-foreground">
                تم إنشاء التقرير بتاريخ: {new Date().toLocaleDateString('ar-SA')}
              </p>
            </CardFooter>
          </Card>
        ) : (
          <div className="flex h-[60vh] items-center justify-center print-hide">
            <Alert className="max-w-xl text-center border-dashed">
              <FileText className="w-8 h-8 mx-auto text-muted-foreground" />
              <AlertTitle className="mt-4 text-xl font-headline">
                لا توجد فواتير لعرضها
              </AlertTitle>
              <AlertDescription className="mt-2 text-muted-foreground">
                بعد معالجة العمليات، سيظهر ملخص الفواتير هنا.
              </AlertDescription>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/operations">الانتقال إلى صفحة العمليات</Link>
                </Button>
              </div>
            </Alert>
          </div>
        )}
      </div>
    </AppShell>
  );
}
