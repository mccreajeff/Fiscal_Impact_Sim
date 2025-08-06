import { z } from 'zod';

export const spendAdjustmentsSchema = z.object({
  health: z.number().min(-1).max(1).default(0),
  defense: z.number().min(-1).max(1).default(0),
  education: z.number().min(-1).max(1).default(0),
});

export const simRequestSchema = z.object({
  taxRate: z.number().min(0).max(50),
  // If GDP is fixed on the server, omit it here.
  gdp: z.number().positive().default(27_000_000_000_000), 
  spendAdjustments: spendAdjustmentsSchema.default({ health: 0, defense: 0, education: 0 }),
});

export const defaultValues = {
  taxRate: 25,
  gdp: 27_000_000_000_000,
  spendAdjustments: { health: 0, defense: 0, education: 0 },
};
