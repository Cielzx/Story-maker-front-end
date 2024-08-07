import { loginData } from "@/app/login/components/validator";
import { z } from "zod";

const userData = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

const updateUserData = userData.partial();

export type updateUserForm = z.infer<typeof updateUserData>;

export const combinedData = z.intersection(loginData, updateUserData);

export type combinedUserData = z.infer<typeof combinedData>;

export default updateUserData;
