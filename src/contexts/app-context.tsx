'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import type { Transaction } from '@/types';
import { determineShift } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { CalculateValetFeesOutput } from '@/ai/flows/calculate-valet-fees';

// Define a more specific type for Excel row data
interface ExcelRow {
  [key: string]: string | number | Date | null;
}

export interface PricingState {
  hourlyRate: number;
  dailyRate: number;
  valetFee: number;
}

interface PerGatePricingState {
  [gate: string]: PricingState;
}

const DEFAULT_PRICING: PricingState = {
  hourlyRate: 35,
  dailyRate: 210,
  valetFee: 50,
};

interface AppContextType {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  addTransactions: (newTransactions: Omit<Transaction, 'id'>[]) => void;
  updateTransaction: (updatedTransaction: Transaction) => void;
  deleteTransactions: (transactionIds: string[]) => void;
  processAndSetTransactions: (
    file: File
  ) => Promise<void>;
  recalculateFeesForFilteredTransactions: (filteredTransactions: Transaction[]) => Promise<void>;
  loading: boolean;
  error: string | null;
  language: 'en' | 'ar';
  toggleLanguage: () => void;
  pricing: PerGatePricingState;
  updatePricing: (gate: string, newPricing: PricingState) => void;
}

export const AppContext = createContext<AppContextType>({
  transactions: [],
  setTransactions: () => {},
  addTransactions: () => {},
  updateTransaction: () => {},
  deleteTransactions: () => {},
  processAndSetTransactions: async () => {},
  recalculateFeesForFilteredTransactions: async () => {},
  loading: false,
  error: null,
  language: 'en',
  toggleLanguage: () => {},
  pricing: { default: DEFAULT_PRICING },
  updatePricing: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [pricing, setPricing] = useState<PerGatePricingState>({
    default: DEFAULT_PRICING,
  });
  const { toast } = useToast();

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  }, []);

  const calculateFeesViaAPI = async (payload: any): Promise<CalculateValetFeesOutput> => {
    const response = await fetch('/api/calculate-fees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API call failed');
    }

    return response.json();
  };
  
  const recalculateFeesForFilteredTransactions = useCallback(async (filteredTransactions: Transaction[]) => {
    if (filteredTransactions.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Transactions to Update',
        description: 'There are no filtered transactions to apply new pricing to.',
      });
      return;
    }

    setLoading(true);
    toast({
      title: 'Updating Fees...',
      description: `Recalculating fees for ${filteredTransactions.length} filtered transactions.`,
    });

    try {
      const recalculatedTransactions = await Promise.all(
        filteredTransactions.map(async (transaction) => {
          const gatePricing = pricing[transaction.exitGate] || pricing.default;
          const newFees = await calculateFeesViaAPI({
            duration: transaction.duration,
            exitGate: transaction.exitGate,
            ...gatePricing,
          });
          return { ...transaction, ...newFees };
        })
      );

      const updatedTransactionsMap = new Map(
        recalculatedTransactions.map((t) => [t.id, t])
      );

      setTransactions((prevTransactions) =>
        prevTransactions.map(
          (t) => updatedTransactionsMap.get(t.id) || t
        )
      );

      toast({
        title: 'Update Complete',
        description: `Fees for ${recalculatedTransactions.length} transactions have been updated.`,
      });

    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'Could not update transaction fees.';
        toast({
          variant: 'destructive',
          title: 'Error Recalculating Fees',
          description: errorMessage,
        });
    } finally {
        setLoading(false);
    }
  }, [pricing, toast]);


  const updatePricing = useCallback((gate: string, newPricing: PricingState) => {
    setPricing((prevPricing) => ({ ...prevPricing, [gate]: newPricing }));
    toast({
      title: 'Pricing Updated',
      description: `Pricing for ${gate === 'default' ? 'Default' : gate} is set. Go to the Operations page to apply it to transactions.`,
    });
  }, [toast]);

  const addTransactions = useCallback(
    (newTransactions: Omit<Transaction, 'id'>[]) => {
      const transactionsWithIds: Transaction[] = newTransactions.map(
        (transaction) => ({
          ...transaction,
          id: crypto.randomUUID(),
        })
      );
      setTransactions((prev) => [...prev, ...transactionsWithIds]);
    },
    []
  );

  const updateTransaction = useCallback(
    (updatedTransaction: Transaction) => {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === updatedTransaction.id ? updatedTransaction : t
        )
      );
    },
    []
  );

  const deleteTransactions = useCallback((transactionIds: string[]) => {
    setTransactions((prev) =>
      prev.filter((t) => !transactionIds.includes(t.id))
    );
  }, []);

  const processAndSetTransactions = useCallback(
    async (file: File) => {
      setLoading(true);
      setError(null);
      
      try {
        toast({
          title: "Processing File...",
          description: "Reading and processing your Excel data. This may take a moment.",
        });

        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(worksheet, { raw: false, defval: null });

        if (!jsonData || jsonData.length === 0) {
          throw new Error("The Excel file is empty or contains no processable data.");
        }

        const headerRow = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] as string[];
        const headers: string[] = headerRow ? headerRow.map(String) : [];
        
        const findHeader = (possibleNames: string[]) => {
          for (const name of possibleNames) {
            const found = headers.find(h => h && h.toLowerCase().trim() === name.toLowerCase().trim());
            if (found) return found;
          }
          return null;
        }

        const headerMapping = {
          entryTime: findHeader(['Entry Time', 'Entry_Time', 'وقت الدخول']),
          exitTime: findHeader(['Exit Time', 'Exit_Time', 'وقت الخروج']),
          duration: findHeader(['Duration', 'المدة']),
          exitGate: findHeader(['Exit Gate', 'Exit_Gate', 'بوابة الخروج']),
          plateNo: findHeader(['Plate No', 'Plate_No', 'رقم اللوحة']),
          payType: findHeader(['Pay Type', 'Pay_Type', 'نوع الدفع']),
        }
        
        const missingHeaders = Object.entries(headerMapping).filter(([, val]) => !val).map(([key]) => key);
        if (missingHeaders.length > 0) {
          throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
        }
        
        const transactionPromises = jsonData.map(async (row, index) => {
            try {
              if (!row || Object.keys(row).length === 0) {
                return null;
              }

              const entryTimeValue = row[headerMapping.entryTime!];
              const exitTimeValue = row[headerMapping.exitTime!];
              const durationValue = row[headerMapping.duration!];

              if (!entryTimeValue || !exitTimeValue || durationValue === null || durationValue === undefined) {
                  return null;
              }

              const entryTime = new Date(entryTimeValue);
              const exitTime = new Date(exitTimeValue);
              let duration: number;

              if (typeof durationValue === 'number') {
                  duration = durationValue < 2 ? durationValue * 24 : durationValue;
              } else if (typeof durationValue === 'string') {
                  const parts = durationValue.split(':');
                  if (parts.length === 2) { // HH:MM
                    const hours = parseInt(parts[0], 10);
                    const minutes = parseInt(parts[1], 10);
                    if (isNaN(hours) || isNaN(minutes)) throw new Error(`Invalid duration string format: ${durationValue}`);
                    duration = hours + (minutes / 60);
                  } else if (parts.length === 3) { // HH:MM:SS
                    const hours = parseInt(parts[0], 10);
                    const minutes = parseInt(parts[1], 10);
                    const seconds = parseInt(parts[2], 10);
                    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) throw new Error(`Invalid duration string format: ${durationValue}`);
                    duration = hours + (minutes / 60) + (seconds / 3600);
                  } else {
                     throw new Error(`Invalid duration string format: ${durationValue}`);
                  }
              } else {
                   throw new Error(`Unsupported duration type: ${typeof durationValue}`);
              }
              
              if (isNaN(entryTime.getTime()) || isNaN(exitTime.getTime()) || typeof duration !== 'number' || isNaN(duration)) {
                throw new Error(`Invalid data format at row ${index + 2}. Check Entry Time, Exit Time and Duration.`);
              }
              
              const gateName = String(row[headerMapping.exitGate!] ?? 'N/A');
              const gatePricing = pricing[gateName] || pricing.default;
              
              const fees = await calculateFeesViaAPI({ 
                duration, 
                exitGate: gateName,
                ...gatePricing 
              });

              const transaction: Transaction = {
                id: crypto.randomUUID(),
                entryTime,
                exitTime,
                exitGate: gateName,
                duration,
                plateNo: String(row[headerMapping.plateNo!] ?? 'N/A'),
                payType: String(row[headerMapping.payType!] ?? 'N/A'),
                shift: determineShift(exitTime),
                ...fees,
              };
              return transaction;
            } catch (e: unknown) {
                const errorMessage = e instanceof Error ? e.message : "Unknown error";
                console.warn(`Error processing row ${index + 2}:`, errorMessage, 'Row data:', row);
                return null; 
            }
          });

        const processedTransactions = (await Promise.all(transactionPromises)).filter((t): t is Transaction => t !== null);

        if (processedTransactions.length === 0) {
            throw new Error("No valid transactions could be processed from the file.");
        }
        
        setTransactions(processedTransactions);
        
        toast({
          title: "Processing Complete",
          description: `${processedTransactions.length} transactions have been successfully loaded.`,
        });

      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during processing.';
        console.error("Error in processAndSetTransactions:", err);
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Processing Failed",
          description: errorMessage,
        });
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    },
    [pricing, toast]
  );

  return (
    <AppContext.Provider
      value={{
        transactions,
        setTransactions,
        addTransactions,
        updateTransaction,
        deleteTransactions,
        processAndSetTransactions,
        recalculateFeesForFilteredTransactions,
        loading,
        error,
        language,
        toggleLanguage,
        pricing,
        updatePricing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
