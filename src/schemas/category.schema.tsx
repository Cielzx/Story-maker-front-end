import { iSubCategories } from "@/context/categoryContext";
import { z } from "zod";
import { StickerSchema } from "./sticker.schema";

const subCategoriesSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    item_name: z.string(),
    category_name: z.string(),
    cover_image: z.string().optional(),
    categoryId: z.string(),
    categories: z.array(subCategoriesSchema),
    stickers: z.array(StickerSchema),
  })
);

export const CategorySchema = z.object({
  id: z.string(),
  category_name: z.string(),
  categories: z.array(subCategoriesSchema),
  cover_image: z.string().optional(),
});

export const combinedCategorySchema = z.intersection(
  z.intersection(CategorySchema, subCategoriesSchema),
  StickerSchema
);
export type CombineCategorySchema = z.infer<typeof combinedCategorySchema>;

export type CategoryData = z.infer<typeof CategorySchema>;
