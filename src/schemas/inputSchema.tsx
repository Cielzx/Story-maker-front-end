import { z } from "zod";

const inputSchema = z.object({
  value: z.string().min(1, "Campo obrigatório"),
});

export default inputSchema;
