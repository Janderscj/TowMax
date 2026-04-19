import { z } from 'zod';

export const VehicleConfigSchema = z.object({
  year: z.number(),
  make: z.string(),
  model: z.string(),
  series: z.string().nullable().optional(),
  engine: z.string(),
  axleRatio: z.string().optional(),
  drive: z.string().optional(),
  cabType: z.string().optional(),
  bedLength: z.string().optional(),
  wheelbase: z.string().optional(),
  gcwr: z.number().nullable().optional(),
  maxTow: z.number().nullable().optional(),
  towPackage: z.string(), // enforce string, fixes Honda issue
  towType: z.string().optional(),
  requires: z.array(z.string()).optional(),
  notes: z.string().optional(),
});
export const VehicleDatasetSchema = z.array(VehicleConfigSchema);
