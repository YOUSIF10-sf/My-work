
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          // General UI
          filterByPlate: 'Filter by plate...',
          reset: 'Reset',
          download: 'Download',
          loading: 'Loading...',
          view: 'View',
          toggleColumns: 'Toggle columns',
          actions: 'Actions',
          operations: 'Operations',

          // Shifts
          morning: 'Morning',
          evening: 'Evening',
          
          // Data Columns
          plateNo: 'Plate Number',
          entryTime: 'Entry Time',
          exitTime: 'Exit Time',
          shift: 'Shift',
          durationHours: 'Duration (Hours)',
          paymentType: 'Payment Type',
          parkingFee: 'Parking Fee',
          valetFee: 'Valet Fee',
          totalFee: 'Total Fee',
          exitGate: 'Exit Gate',
          
          // Toolbar Features
          showDuplicates: 'Show Duplicates',
          recalculateFees: 'Recalculate Fees',
          recalculating: 'Recalculating...',
          recalculationSuccess: 'Fees recalculated successfully.',
          recalculationError: 'Failed to recalculate fees.',

          // Export
          reportFileName: 'Valet_Operations_Report',
          analysisSheetName: 'Analysis',
          rawDataSheetName: 'Raw Data',
          noDataAvailable: 'No data available for analysis.',
          metric: 'Metric',
          value: 'Value',
          totalRevenue: 'Total Revenue',
          totalParkingFees: 'Total Parking Fees',
          totalValetFees: 'Total Valet Fees',
          totalTransactions: 'Total Transactions',
          averageTransactionValue: 'Average Transaction Value',
          incomeByPayType: 'Income by Payment Type',
          incomeByExitGate: 'Income by Exit Gate',
          transactionsByShift: 'Transactions by Shift',
          CASH: 'Cash',
          CARD: 'Card', 
          'N/A': 'N/A',
        },
      },
      ar: {
        translation: {
          // General UI
          filterByPlate: 'بحث حسب اللوحة...',
          reset: 'إعادة تعيين',
          download: 'تحميل',
          loading: 'جاري التحميل...',
          view: 'عرض',
          toggleColumns: 'تبديل الأعمدة',
          actions: 'الإجراءات',
          operations: 'العمليات',

          // Shifts
          morning: 'صباحي',
          evening: 'مسائي',

          // Data Columns
          plateNo: 'رقم اللوحة',
          entryTime: 'وقت الدخول',
          exitTime: 'وقت الخروج',
          shift: 'الوردية',
          durationHours: 'المدة (ساعات)',
          paymentType: 'نوع الدفع',
          parkingFee: 'رسوم المواقف',
          valetFee: 'رسوم خدمة صف السيارات',
          totalFee: 'المبلغ الإجمالي',
          exitGate: 'بوابة الخروج',
          
          // Toolbar Features
          showDuplicates: 'إظهار المكررة',
          recalculateFees: 'إعادة حساب الرسوم',
          recalculating: 'جاري الحساب...',
          recalculationSuccess: 'تمت إعادة حساب الرسوم بنجاح.',
          recalculationError: 'فشلت إعادة حساب الرسوم.',

          // Export
          reportFileName: 'تقرير_عمليات_الركن',
          analysisSheetName: 'تحليل البيانات',
          rawDataSheetName: 'البيانات الخام',
          noDataAvailable: 'لا توجد بيانات متاحة للتحليل.',
          metric: 'المقياس',
          value: 'القيمة',
          totalRevenue: 'إجمالي الدخل',
          totalParkingFees: 'إجمالي رسوم المواقف',
          totalValetFees: 'إجمالي رسوم خدمة الركن',
          totalTransactions: 'إجمالي المعاملات',
          averageTransactionValue: 'متوسط قيمة المعاملة',
          incomeByPayType: 'الدخل حسب نوع الدفع',
          incomeByExitGate: 'الدخل حسب بوابة الخروج',
          transactionsByShift: 'المعاملات حسب الوردية',
          CASH: 'نقداً',
          CARD: 'بطاقة',
          'N/A': 'غير محدد',
        },
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export const useTranslations = () => useTranslation().t;

export type TFunction = typeof i18n.t;
export default i18n;
