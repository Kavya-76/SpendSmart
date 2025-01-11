import * as z from "zod";
export const ResetPasswordSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(8, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(8, {
    message: "Minimum 8 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Minimum 8 characters required",
  }),
});

export const BudgetSchema = z.object({
  title: z.string({
    message: "Budget title is required",
  }),
  amount: z.number().min(0, {
    message: "Budget amount must be at least 0",
  }),
  description: z.optional(z.string()),
  icon: z.optional(z.string()),
});

export const ExpenseSchema = z.object({
  title: z.string({
    message: "Expense title is required",
  }),
  amount: z.number().min(0, {
    message: "Expense amount must be at least 0",
  }),
  description: z.optional(z.string()),
  icon: z.optional(z.string()),
  budgetId: z.string({
    message: "Budget ID is required",
  }),
  createdAt: z.optional(
    z.date()
    // z
    //   .string()
    //   .refine((str) => !isNaN(Date.parse(str)), {
    //     message: "Invalid date format",
    //   })
    //   .transform((str) => new Date(str))
  ),
});

export const IncomeSchema = z.object({
  title: z.string({
    message: "Income title is required",
  }),
  amount: z.number().min(0, {
    message: "Income amount must be at least 0",
  }),
  description: z.optional(z.string()),
  icon: z.optional(z.string()),
});
