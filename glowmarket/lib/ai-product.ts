import { z } from "zod";

const optionalText = z.string().trim().max(2000).optional().default("");

export const productInputSchema = z.object({
  productName: z.string().trim().min(2).max(120),
  brand: z.string().trim().min(1).max(100),
  category: z.string().trim().min(2).max(80),
  price: z.number().positive().max(1_000_000),
  stock: z.number().int().min(0).max(1_000_000),
  size: z.string().trim().min(1).max(50),
  suitableFor: optionalText,
  ingredients: optionalText,
  notes: optionalText,
  language: z.enum(["English", "Swedish"]),
});

export const generatedProductSchema = z.object({
  title: z.string().max(140),
  description: z.string().max(1600),
  benefits: z.array(z.string().max(180)).max(6),
  usage: z.string().max(800),
  tags: z.array(z.string().max(50)).max(10),
  suggestedCategory: z.string().max(80),
});

export const acceptedProductSchema = productInputSchema.extend({
  generated: generatedProductSchema,
});

export type ProductInput = z.infer<typeof productInputSchema>;
export type GeneratedProduct = z.infer<typeof generatedProductSchema>;
