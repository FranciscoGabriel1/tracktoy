import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  birth: z.string().min(10, "Birth date is required"),
});

export type ClientForm = z.infer<typeof clientSchema>;
