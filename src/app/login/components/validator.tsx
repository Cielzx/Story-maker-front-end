import { z } from "zod";

export const loginData = z.object({
  email: z.string().email().min(1, "E-mail obrigatorio"),
  password: z.string().min(1, "Senha obrigatoria"),
});

export const RegisterData = z.object({
  name: z.string().min(1, "Usuario obrigatorio"),
  email: z.string().email().min(1, "E-mail obrigatorio"),
  password: z.string().min(1, "Senha obrigatoria"),
});

export const combinedSchema = z.intersection(loginData, RegisterData);
export type CombinedSchema = z.infer<typeof combinedSchema>;

export type LoginData = z.infer<typeof loginData>;
export type iRegisterData = z.infer<typeof RegisterData>;

export interface iErrosType extends CombinedSchema {
  value: string;
}
