import { z } from "zod";

export const stickerSchema = z.object({
  id: z.string(),
  figure_name: z.string().min(1, "Nome não pode ser vazio"),
  figure_image: z.string().min(1, "Imagem obrigatoria"),
});
