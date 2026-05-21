import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export const leadSchema = z.object({
  parentName: z.string().min(2, "Введіть коректне ім'я"),
  phone: z
    .string()
    .min(1, "Введіть номер телефону")
    .refine((value) => isValidPhoneNumber(value), {
      message: "Невірний номер для обраної країни",
    }),
  childAge: z.coerce.number().min(7).max(17),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
