
export const translations = {
  ar: {
    // General
    appName: 'Valet Insights',
    dashboard: 'لوحة التحكم',
    operations: 'العمليات',
    invoices: 'الفواتير',
    settings: 'الإعدادات',
    revenue: 'الإيرادات',
    transactions: 'العمليات',
    exitGate: 'بوابة الخروج',
    totalRevenue: 'إجمالي الإيرادات',
    totalTransactions: 'إجمالي العمليات',
    averageFee: 'متوسط الرسوم',
    search: 'ابحث...',
    filterBy: 'تصفية حسب',
    clear: 'مسح',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    error: 'خطأ',
    success: 'نجاح',
    loading: 'جار التحميل...',
    noData: 'لا توجد بيانات',
    all: 'الكل',
    valetFee: 'رسوم خدمة صف السيارات',
    parkingFee: 'رسوم المواقف',
    reset: 'إعادة تعيين',
    download: 'تنزيل',
    applyNewPricing: 'تطبيق تسعيرة جديدة',
    filterByPlate: 'تصفية حسب رقم اللوحة...',
    locale: 'ar-SA',
    currency: 'SAR',

    // Data Table
    selectAll: 'تحديد الكل',
    selectRow: 'تحديد صف',
    shift: 'الوردية',
    morning: 'صباحي',
    evening: 'مسائي',
    transactionsDeleted: (count: number) => `تم حذف ${count} عملية بنجاح.`,

    // File Uploader
    uploadFile: 'رفع ملف إكسل',
    processingFile: 'جاري معالجة الملف...',
    fileProcessed: 'تمت معالجة الملف بنجاح',
    fileProcessingError: 'حدث خطأ أثناء معالجة الملف',
    dragAndDrop: 'اسحب وأفلت ملف Excel هنا، أو انقر للتحديد',

    // Edit Transaction
    editTransaction: 'تعديل العملية',
    entryTime: 'وقت الدخول',
    exitTime: 'وقت الخروج',
    totalFee: 'إجمالي الرسوم (ر.س)',
    transactionUpdated: 'تم تحديث العملية بنجاح',
    transactionUpdateFailed: 'فشل تحديث العملية',
    pickDate: 'اختر تاريخًا',
    plateNumber: 'رقم اللوحة',
    durationHours: 'المدة (ساعة)',
    paymentType: 'نوع الدفع',
    plateNumberRequired: 'رقم اللوحة مطلوب.',
    exitTimeRequired: 'وقت الخروج مطلوب.',
    exitGateRequired: 'بوابة الخروج مطلوبة.',
    durationPositive: 'يجب أن تكون المدة رقمًا موجبًا.',
    paymentTypeRequired: 'نوع الدفع مطلوب.',
    editTransactionDescription: 'قم بإجراء تغييرات على العملية هنا. انقر فوق حفظ عند الانتهاء.',

    // Invoices
    invoiceSummary: 'ملخص الفاتورة',
    invoiceNumber: 'رقم الفاتورة',
    issueDate: 'تاريخ الإصدار',
    printInvoice: 'طباعة الفاتورة',
    downloadPDF: 'تنزيل كـ PDF',
    downloadWord: 'تنزيل كـ Word',
    totalAmount: 'المبلغ الإجمالي',
    noInvoices: 'لا توجد فواتير لعرضها',
    goToOperations: 'الانتقال إلى صفحة العمليات',
    invoiceGeneratedDate: 'تم إنشاء التقرير بتاريخ',

    // Dashboard
    welcomeToValetInsights: 'مرحباً بك في Valet Insights',
    dashboardWelcomeMessage: 'لوحة التحكم الخاصة بك جاهزة. قم برفع ملف بيانات في صفحة العمليات لرؤية تحليلاتك.',

    // Export
    exportStartedTitle: 'بدأ التصدير',
    exportStartedDescription: 'جاري إنشاء تقرير تحليل البيانات الخاص بك...',
    exportFailedTitle: 'فشل التصدير',
    exportNoData: 'لا توجد بيانات للتصدير.',
    exportCompleteTitle: 'اكتمل التصدير',
    exportCompleteDescription: 'تم تنزيل تقريرك.',
    exportUnexpectedError: 'حدث خطأ غير متوقع أثناء إنشاء التقرير.',
    accountantReportTitle: "Valet Insights - تقرير المحاسب",
    accountantSummary: "ملخص المحاسب",
    keyFinancialMetrics: "المقاييس المالية الرئيسية",
    metric: "المقياس",
    value: "القيمة",
    averageTransactionValue: "متوسط قيمة العملية",
    revenueByGate: "الإيرادات حسب البوابة",
    gate: "البوابة",
    revenueByShift: "الإيرادات حسب الوردية",
    revenueByPayType: "الإيرادات حسب نوع الدفع",
    type: "النوع",
    accountantSummarySheet: "ملخص المحاسب",
    generalReportTitle: "Valet Insights - تقرير عام",
    generalSummary: "ملخص عام",
    keyMetrics: "المقاييس الرئيسية",
    highestEarningGate: "البوابة الأعلى ربحًا",
    busiestHour: "ساعة الذروة",
    generalSummarySheet: "ملخص عام",
    detailedTransactionsSheet: "العمليات التفصيلية",
    reportFileName: "تقرير_Valet_Insights",

  },
  en: {
    // General
    appName: 'Valet Insights',
    dashboard: 'Dashboard',
    operations: 'Operations',
    invoices: 'Invoices',
    settings: 'Settings',
    revenue: 'Revenue',
    transactions: 'Transactions',
    exitGate: 'Exit Gate',
    totalRevenue: 'Total Revenue',
    totalTransactions: 'Total Transactions',
    averageFee: 'Average Fee',
    search: 'Search...',
    filterBy: 'Filter by',
    clear: 'Clear',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    error: 'Error',
    success: 'Success',
    loading: 'Loading...',
    noData: 'No data',
    all: 'All',
    valetFee: 'Valet Fee',
    parkingFee: 'Parking Fee',
    reset: 'Reset',
    download: 'Download',
    applyNewPricing: 'Apply New Pricing',
    filterByPlate: 'Filter by plate number...',
    locale: 'en-US',
    currency: 'SAR',

    // Data Table
    selectAll: 'Select all',
    selectRow: 'Select row',
    shift: 'Shift',
    morning: 'Morning',
    evening: 'Evening',
    transactionsDeleted: (count: number) => `${count} transaction(s) deleted.`,

    // File Uploader
    uploadFile: 'Upload Excel File',
    processingFile: 'Processing file...',
    fileProcessed: 'File processed successfully',
    fileProcessingError: 'An error occurred while processing the file',
    dragAndDrop: 'Drag \'n\' drop an Excel file here, or click to select',

    // Edit Transaction
    editTransaction: 'Edit Transaction',
    entryTime: 'Entry Time',
    exitTime: 'Exit Time',
    totalFee: 'Total Fee (SAR)',
    transactionUpdated: 'Transaction updated successfully.',
    transactionUpdateFailed: 'Failed to update transaction.',
    pickDate: 'Pick a date',
    plateNumber: 'Plate Number',
    durationHours: 'Duration (hrs)',
    paymentType: 'Payment Type',
    plateNumberRequired: 'Plate number is required.',
    exitTimeRequired: 'Exit time is required.',
    exitGateRequired: 'Exit gate is required.',
    durationPositive: 'Duration must be a positive number.',
    paymentTypeRequired: 'Payment type is required.',
    editTransactionDescription: "Make changes to the transaction here. Click save when you're done.",

    // Invoices
    invoiceSummary: 'Invoice Summary',
    invoiceNumber: 'Invoice Number',
    issueDate: 'Issue Date',
    printInvoice: 'Print Invoice',
    downloadPDF: 'Download as PDF',
    downloadWord: 'Download as Word',
    totalAmount: 'Total Amount',
    noInvoices: 'No invoices to display',
    goToOperations: 'Go to Operations Page',
    invoiceGeneratedDate: 'Report generated on',

    // Dashboard
    welcomeToValetInsights: 'Welcome to Valet Insights',
    dashboardWelcomeMessage: 'Your dashboard is ready. Upload a data file on the Operations page to see your analytics.',

    // Export
    exportStartedTitle: 'Export Started',
    exportStartedDescription: 'Generating your data analysis report...',
    exportFailedTitle: 'Export Failed',
    exportNoData: 'No data to export.',
    exportCompleteTitle: 'Export Complete',
    exportCompleteDescription: 'Your report has been downloaded.',
    exportUnexpectedError: 'An unexpected error occurred while generating the report.',
    accountantReportTitle: "Valet Insights - Accountant's Report",
    accountantSummary: "Accountant's Summary",
    keyFinancialMetrics: "Key Financial Metrics",
    metric: "Metric",
    value: "Value",
    averageTransactionValue: "Average Transaction Value",
    revenueByGate: "Revenue by Gate",
    gate: "Gate",
    revenueByShift: "Revenue by Shift",
    revenueByPayType: "Revenue by Payment Type",
    type: "Type",
    accountantSummarySheet: "Accountant's Summary",
    generalReportTitle: "Valet Insights - General Report",
    generalSummary: "General Summary",
    keyMetrics: "Key Metrics",
    highestEarningGate: "Highest Earning Gate",
    busiestHour: "Busiest Hour",
    generalSummarySheet: "General Summary",
    detailedTransactionsSheet: "Detailed Transactions",
    reportFileName: "Valet_Insights_Report",

  },
};

// A simple hook to get the translations based on a locale
// In a real app, you would get the locale from a context or a library like next-intl
export const useTranslations = (locale: 'ar' | 'en' = 'ar') => {
  const translationsForLocale = translations[locale];

  // A proxy to handle dynamic functions like transactionsDeleted
  return new Proxy(translationsForLocale, {
    get(target, prop) {
      if (typeof (target as any)[prop] === 'function') {
        return (target as any)[prop];
      } 
      return (target as any)[prop] || prop;
    }
  });
};
