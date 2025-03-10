import * as z from "Zod";

export const SignupValidation = z.object({
  name: z.string().min(3, { message: "Too short" }),
  username: z.string().min(2, { message: "Too short" }),
  email: z.string().email(),
  password: z.string().min(8, { message: "password must be 8 charter" }),
});

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: " invaild password" }),
});

export const PostValidation = z.object({
  caption: z.string().min(3, { message: "Too short" }),
  file:z.custom<File[]>(),
  location: z.string().min(3, { message: "Too short" }),
  tags: z.string()
});
