import * as XLSX from 'xlsx';
import { Transaction } from '@/types';
import { TFunction } from '@/lib/i18n';

interface AnalysisData {
    [key: string]: string | number;
}

// Helper function to format currency
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR' }).format(amount);
};

// Main export function
export const exportToExcel = (data: Transaction[], t: TFunction) => {
    // 1. ANALYSIS SHEET
    const analysis = analyzeTransactions(data, t);
    const analysisSheet = XLSX.utils.json_to_sheet(analysis.dataForSheet);

    // --- Auto-fit columns for analysis sheet ---
    const analysisCols = Object.keys(analysis.dataForSheet[0] || {}).map(key => ({ wch: Math.max(key.length, ...analysis.dataForSheet.map(row => String(row[key as keyof AnalysisData]).length)) + 2 }));
    analysisSheet['!cols'] = analysisCols;

    // 2. RAW DATA SHEET
    const rawData = data.map(trans => ({
        [t('plateNo')]: trans.plateNo,
        [t('entryTime')]: trans.entryTime ? new Date(trans.entryTime).toLocaleString('sv-SE') : 'N/A',
        [t('exitTime')]: trans.exitTime ? new Date(trans.exitTime).toLocaleString('sv-SE') : 'N/A',
        [t('shift')]: t(trans.shift),
        [t('durationHours')]: trans.duration.toFixed(2),
        [t('paymentType')]: t(trans.payType),
        [t('parkingFee')]: formatCurrency(trans.parkingFee),
        [t('valetFee')]: formatCurrency(trans.valetFee),
        [t('totalFee')]: formatCurrency(trans.totalFee),
        [t('exitGate')]: trans.exitGate,
    }));

    const rawDataSheet = XLSX.utils.json_to_sheet(rawData);
    
    // --- Auto-fit columns for raw data sheet ---
    const rawDataCols = Object.keys(rawData[0] || {}).map(key => ({ wch: Math.max(key.length, ...rawData.map(row => String(row[key as keyof typeof rawData[0]]).length)) + 2 }));
    rawDataSheet['!cols'] = rawDataCols;


    // 3. CREATE AND EXPORT WORKBOOK
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, analysisSheet, t('analysisSheetName'));
    XLSX.utils.book_append_sheet(workbook, rawDataSheet, t('rawDataSheetName'));
    XLSX.writeFile(workbook, `${t('reportFileName')}.xlsx`);
};


// The new analysis function
const analyzeTransactions = (transactions: Transaction[], t: TFunction) => {
    if (transactions.length === 0) {
        return {
            dataForSheet: [[t('noDataAvailable')]],
            // Return zeroed or empty values for all stats
            totalRevenue: 0,
            totalParkingFees: 0,
            totalValetFees: 0,
            totalTransactions: 0,
            averageTransactionValue: 0,
            incomeByPayType: {},
            incomeByExitGate: {},
            transactionsByShift: {},
        };
    }

    const totalRevenue = transactions.reduce((sum, t) => sum + t.totalFee, 0);
    const totalParkingFees = transactions.reduce((sum, t) => sum + t.parkingFee, 0);
    const totalValetFees = transactions.reduce((sum, t) => sum + t.valetFee, 0);
    const totalTransactions = transactions.length;
    const averageTransactionValue = totalRevenue / totalTransactions;

    const incomeByPayType = transactions.reduce((acc, t) => {
        const payType = t.payType || 'N/A';
        acc[payType] = (acc[payType] || 0) + t.totalFee;
        return acc;
    }, {} as { [key: string]: number });

    const incomeByExitGate = transactions.reduce((acc, t) => {
        const gate = t.exitGate || 'N/A';
        acc[gate] = (acc[gate] || 0) + t.totalFee;
        return acc;
    }, {} as { [key: string]: number });

    const transactionsByShift = transactions.reduce((acc, t) => {
        const shift = t.shift || 'N/A';
        acc[shift] = (acc[shift] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    const dataForSheet: AnalysisData[] = [
        { [t('metric')]: t('totalRevenue'), [t('value')]: formatCurrency(totalRevenue) },
        { [t('metric')]: t('totalParkingFees'), [t('value')]: formatCurrency(totalParkingFees) },
        { [t('metric')]: t('totalValetFees'), [t('value')]: formatCurrency(totalValetFees) },
        { [t('metric')]: t('totalTransactions'), [t('value')]: totalTransactions },
        { [t('metric')]: t('averageTransactionValue'), [t('value')]: formatCurrency(averageTransactionValue) },
        { [t('metric')]: '---', [t('value')]: '---' }, // Separator
        { [t('metric')]: t('incomeByPayType'), [t('value')]: '' },
        ...Object.entries(incomeByPayType).map(([payType, amount]) => ({
            [t('metric')]: `  - ${t(payType)}`, 
            [t('value')]: formatCurrency(amount)
        })),
        { [t('metric')]: '---', [t('value')]: '---' }, // Separator
        { [t('metric')]: t('incomeByExitGate'), [t('value')]: '' },
        ...Object.entries(incomeByExitGate).map(([gate, amount]) => ({ 
            [t('metric')]: `  - ${gate}`,
            [t('value')]: formatCurrency(amount)
        })),
        { [t('metric')]: '---', [t('value')]: '---' }, // Separator
        { [t('metric')]: t('transactionsByShift'), [t('value')]: '' },
        ...Object.entries(transactionsByShift).map(([shift, count]) => ({ 
            [t('metric')]: `  - ${t(shift)}`,
            [t('value')]: count
        })),
    ];

    return { dataForSheet, totalRevenue, totalParkingFees, totalValetFees, totalTransactions, averageTransactionValue, incomeByPayType, incomeByExitGate, transactionsByShift };
};