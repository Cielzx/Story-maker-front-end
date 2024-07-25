import { Sticker } from "lucide-react";
import { z } from "zod";
import { StickerSchema } from "./sticker.schema";

export const favoriteSchema = z.object({
  id: z.string(),
  sticker: StickerSchema,
});

export type favoriteData = z.infer<typeof favoriteSchema>;
