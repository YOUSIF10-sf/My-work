import * as XLSX from 'xlsx';
import { Transaction } from '@/types';
import { TFunction } from '@/lib/i18n';

export const exportToExcel = (data: Transaction[], t: TFunction) => {
  const accountantReportData = data.map(trans => ({
    [t('plateNo')]: trans.plateNo,
    [t('entryTime')]: trans.entryTime,
    [t('exitTime')]: trans.exitTime,
    [t('shift')]: trans.shift,
    [t('durationHours')]: trans.duration,
    [t('paymentType')]: trans.payType,
    [t('parkingFee')]: trans.parkingFee,
    [t('valetFee')]: trans.valetFee,
    [t('totalFee')]: trans.totalFee,
    [t('exitGate')]: trans.exitGate,
  }));

  const generalReportData = data.map(trans => ({
    [t('plateNo')]: trans.plateNo,
    [t('entryTime')]: trans.entryTime,
    [t('exitTime')]: trans.exitTime,
    [t('shift')]: trans.shift,
    [t('durationHours')]: trans.duration,
    [t('exitGate')]: trans.exitGate,
  }));

  const accountantWorksheet = XLSX.utils.json_to_sheet(accountantReportData);
  const generalWorksheet = XLSX.utils.json_to_sheet(generalReportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, accountantWorksheet, t('accountantSummarySheet'));
  XLSX.utils.book_append_sheet(workbook, generalWorksheet, t('generalSummarySheet'));
  XLSX.writeFile(workbook, t('reportFileName') + '.xlsx');
};
