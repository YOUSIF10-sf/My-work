'use server';
/**
 * @fileOverview A flow to analyze valet transaction data and provide insights.
 *
 * - analyzeValetData - A function that analyzes a list of transactions.
 * - AnalyzeValetDataInput - The input type for the analyzeValetData function.
 * - AnalyzeValetDataOutput - The return type for the analyzeValetData function.
 */

import { ai } from '@/ai/genkit';
import { Transaction } from '@/types';
import { z } from 'genkit';

// This schema represents the input to the flow from the client.
const ClientTransactionSchema = z.object({
  id: z.string(),
  exitTime: z.date(),
  exitGate: z.string(),
  duration: z.number(),
  plateNo: z.string(),
  payType: z.string(),
  shift: z.enum(['Morning', 'Evening']),
  parkingFee: z.number(),
  valetFee: z.number(),
  totalFee: z.number(),
});

// This schema represents the data sent to the AI (with date as string).
const AITransactionSchema = ClientTransactionSchema.extend({
    exitTime: z.string().datetime(),
});

const AnalyzeValetDataInputSchema = z.array(AITransactionSchema);
export type AnalyzeValetDataInput = z.infer<typeof AnalyzeValetDataInputSchema>;

// Schema for the AI model's output (simplified)
const AIAnalysisOutputSchema = z.object({
  summary: z.string().describe('A concise, insightful summary of the data analysis in 2-3 sentences. Highlight key trends, performance, and actionable insights for a general audience. For example, mention the top-performing gate and busiest times. The summary should be in the same language as the gate names if possible.'),
  accountantSummary: z.string().describe('A summary tailored for an accountant in 3-4 sentences. Focus on financial implications, revenue streams, and potential areas for financial optimization. Mention which segments (gates, shifts, payment types) are most profitable. The summary should be in the same language as the gate names if possible.'),
});

// Final output schema including locally calculated fields
const AnalyzeValetDataOutputSchema = AIAnalysisOutputSchema.extend({
  totalRevenue: z.number(),
  totalTransactions: z.number(),
  averageTransactionValue: z.number(),
  revenueByGate: z.record(z.string(), z.number()),
  transactionsByGate: z.record(z.string(), z.number()),
  revenueByShift: z.record(z.string(), z.number()),
  transactionsByShift: z.record(z.string(), z.number()),
  revenueByPayType: z.record(z.string(), z.number()),
  highestEarningGate: z.object({
    gate: z.string(),
    revenue: z.number(),
  }),
  peakHour: z.object({
    hour: z.number(),
    transactions: z.number(),
    revenue: z.number(),
  }),
});
export type AnalyzeValetDataOutput = z.infer<typeof AnalyzeValetDataOutputSchema>;


export async function analyzeValetData(input: Transaction[]): Promise<AnalyzeValetDataOutput> {
    const flowInput = input.map(t => ({...t, exitTime: t.exitTime.toISOString()}));
    return analyzeValetDataFlow(flowInput);
}

const analysisPrompt = ai.definePrompt({
    name: 'valetAnalysisPrompt',
    input: { schema: z.object({ transactionsJson: z.string() })},
    output: { schema: AIAnalysisOutputSchema }, // Use the simplified schema for the AI
    prompt: `You are an expert business analyst for a valet parking company.
    Based on the provided transaction data, generate two summaries:
    1. A general 'summary' of the analysis in 2-3 sentences. Highlight key trends, top-performing gate, and busiest times.
    2. An 'accountantSummary' tailored for an accountant in 3-4 sentences. Focus on financial implications, revenue streams, and profitability.

    The language for the summaries should match the language of the gate names if possible.
    Return a single, clean JSON object that strictly adheres to the provided output schema.

    Transaction Data:
    \`\`\`json
    {{{transactionsJson}}}
    \`\`\`
    `,
});


const analyzeValetDataFlow = ai.defineFlow(
  {
    name: 'analyzeValetDataFlow',
    inputSchema: AnalyzeValetDataInputSchema,
    outputSchema: AnalyzeValetDataOutputSchema,
  },
  async (transactions) => {
    if (transactions.length === 0) {
      return {
        totalRevenue: 0,
        totalTransactions: 0,
        averageTransactionValue: 0,
        revenueByGate: {},
        transactionsByGate: {},
        revenueByShift: {},
        transactionsByShift: {},
        revenueByPayType: {},
        highestEarningGate: { gate: 'N/A', revenue: 0 },
        peakHour: { hour: 0, transactions: 0, revenue: 0 },
        summary: 'No transaction data available to analyze.',
        accountantSummary: 'No financial data available for analysis.',
      };
    }

    try {
        // --- Local Calculations ---
        const totalRevenue = transactions.reduce((sum, t) => sum + t.totalFee, 0);
        const totalTransactions = transactions.length;
        const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

        const revenueByGate: Record<string, number> = {};
        const transactionsByGate: Record<string, number> = {};
        const revenueByShift: Record<string, number> = {};
        const transactionsByShift: Record<string, number> = {};
        const revenueByPayType: Record<string, number> = {};
        const hourlyData: Record<number, { transactions: number; revenue: number }> = {};

        for (const t of transactions) {
          // Gate
          revenueByGate[t.exitGate] = (revenueByGate[t.exitGate] || 0) + t.totalFee;
          transactionsByGate[t.exitGate] = (transactionsByGate[t.exitGate] || 0) + 1;

          // Shift
          revenueByShift[t.shift] = (revenueByShift[t.shift] || 0) + t.totalFee;
          transactionsByShift[t.shift] = (transactionsByShift[t.shift] || 0) + 1;

          // Pay Type
          revenueByPayType[t.payType] = (revenueByPayType[t.payType] || 0) + t.totalFee;
          
          // Peak Hour
          const hour = new Date(t.exitTime).getHours();
          if (!hourlyData[hour]) {
            hourlyData[hour] = { transactions: 0, revenue: 0 };
          }
          hourlyData[hour].transactions++;
          hourlyData[hour].revenue += t.totalFee;
        }

        const highestEarningGate = Object.entries(revenueByGate).reduce(
            (max, [gate, revenue]) => (revenue > max.revenue ? { gate, revenue } : max),
            { gate: 'N/A', revenue: 0 }
        );

        const peakHour = Object.entries(hourlyData).reduce(
            (max, [hourStr, data]) => {
                const hour = parseInt(hourStr, 10);
                return data.transactions > max.transactions ? { ...data, hour } : max;
            },
            { hour: -1, transactions: 0, revenue: 0 }
        );


        // --- AI Analysis for Summaries ---
        const transactionsJson = JSON.stringify(transactions.slice(0, 200), null, 2); // Limit data sent to AI
        const { output: aiOutput } = await analysisPrompt({ transactionsJson });

        if (!aiOutput) {
            throw new Error("AI analysis failed to produce summaries.");
        }

        // --- Combine local calculations and AI summaries ---
        return {
            ...aiOutput,
            totalRevenue,
            totalTransactions,
            averageTransactionValue,
            revenueByGate,
            transactionsByGate,
            revenueByShift,
            transactionsByShift,
            revenueByPayType,
            highestEarningGate,
            peakHour,
        };
    } catch (error) {
        console.error("Error in analysis flow:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to analyze data: ${errorMessage}`);
    }
  }
);
