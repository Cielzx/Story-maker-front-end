import { Sticker } from "lucide-react";
import { z } from "zod";
import { stickerSchema } from "./sticker.schema";

export const favoriteSchema = z.object({
  id: z.string(),
  sticker: stickerSchema,
});

export type favoriteData = z.infer<typeof favoriteSchema>;
