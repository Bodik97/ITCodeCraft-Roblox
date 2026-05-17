import { z } from "zod";

export const leadSchema = z.object({
  parentName: z.string().min(2, "Введіть коректне ім'я"),
  phone: z
    .string()
    .regex(/^(\+?380|0)\d{9}$/, "Невірний формат (наприклад: 0501234567)"),
  childAge: z.coerce.number().min(7).max(17),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
