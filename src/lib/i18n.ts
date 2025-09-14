
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
          // Existing translations
          filterByPlate: 'Filter by plate...',
          morning: 'Morning',
          evening: 'Evening',
          reset: 'Reset',
          download: 'Download',
          loading: 'Loading...',
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
          accountantSummarySheet: 'Accountant Summary',
          generalSummarySheet: 'General Summary',
          reportFileName: 'Valet_Operations_Report',
          showDuplicates: 'Show Duplicates',

          // New translations for view options
          view: 'View',
          toggleColumns: 'Toggle columns',

          // Translations for column IDs
          actions: 'Actions',
        },
      },
      ar: {
        translation: {
          // Existing translations
          filterByPlate: 'بحث حسب اللوحة...',
          morning: 'صباحي',
          evening: 'مسائي',
          reset: 'إعادة تعيين',
          download: 'تحميل',
          loading: 'جاري التحميل...',
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
          accountantSummarySheet: 'ملخص المحاسب',
          generalSummarySheet: 'ملخص عام',
          reportFileName: 'تقرير_عمليات_خدمة_صف_السيارات',
          showDuplicates: 'إظهار المكررة',

          // New translations for view options
          view: 'عرض',
          toggleColumns: 'تبديل الأعمدة',

          // Translations for column IDs
          actions: 'الإجراءات',
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
