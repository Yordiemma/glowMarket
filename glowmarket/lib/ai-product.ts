import { z } from "zod";

const optionalText = z.string().trim().max(2000).optional().default("");

export const productInputSchema = z.object({
  imageDataUrl: z.string().startsWith("data:image/").max(6_000_000),
  productName: z.string().trim().min(2).max(120),
  brand: z.string().trim().min(1).max(100),
  size: z.string().trim().min(1).max(50),
  category: z.enum(["Hair Care", "Skincare", "Nails", "Makeup", "Hair Extensions", "Beauty Tools"]),
  productHint: z.string().trim().max(300).optional().default(""),
  price: z.number().positive().max(1_000_000),
  stock: z.number().int().min(0).max(1_000_000),
  language: z.enum(["English", "Swedish"]),
});

export const generatedProductSchema = z.object({
  title: z.string().max(140),
  brand: z.string().max(100),
  size: z.string().max(50),
  description: z.string().max(1600),
  benefits: z.array(z.string().max(180)).max(6),
  usage: z.string().max(800),
  tags: z.array(z.string().max(50)).max(10),
  suggestedCategory: z.string().max(80),
  suitableFor: optionalText,
  ingredients: optionalText,
});

export const acceptedProductSchema = productInputSchema.extend({
  generated: generatedProductSchema,
});

export type ProductInput = z.infer<typeof productInputSchema>;
export type GeneratedProduct = z.infer<typeof generatedProductSchema>;
