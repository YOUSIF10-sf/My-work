'use server';
/**
 * @fileOverview Flow to calculate valet parking fees based on duration and apply a fixed valet service fee.
 *
 * - calculateValetFees - A function that calculates the total charges for each transaction.
 * - CalculateValetFeesInput - The input type for the calculateValetFees function.
 * - CalculateValetFeesOutput - The return type for the calculateValetFees function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateValetFeesInputSchema = z.object({
  duration: z
    .number()
    .describe('The duration of the parking stay in hours.'),
  hourlyRate: z.number().describe('The hourly rate for parking for the specific gate.'),
  dailyRate: z.number().describe('The daily rate for parking for the specific gate.'),
  valetFee: z.number().describe('The valet service fee for the specific gate.'),
  exitGate: z.string().describe('The exit gate for the transaction.'),
});
export type CalculateValetFeesInput = z.infer<typeof CalculateValetFeesInputSchema>;

const CalculateValetFeesOutputSchema = z.object({
  parkingFee: z.number().describe('The calculated parking fee.'),
  valetFee: z.number().describe('The fixed valet service fee.'),
  totalFee: z.number().describe('The total fee including parking and valet.'),
});
export type CalculateValetFeesOutput = z.infer<typeof CalculateValetFeesOutputSchema>;

export async function calculateValetFees(input: CalculateValetFeesInput): Promise<CalculateValetFeesOutput> {
  return calculateValetFeesFlow(input);
}

const calculateValetFeesFlow = ai.defineFlow(
  {
    name: 'calculateValetFeesFlow',
    inputSchema: CalculateValetFeesInputSchema,
    outputSchema: CalculateValetFeesOutputSchema,
  },
  async input => {
    const { duration, hourlyRate, dailyRate, valetFee } = input;

    let parkingFee: number;
    if (duration <= 6) {
      parkingFee = duration * hourlyRate;
    } else {
      parkingFee = dailyRate;
    }

    const totalFee = parkingFee + valetFee;

    return {
      parkingFee,
      valetFee,
      totalFee,
    };
  }
);
