"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid corporate email address."),
  password: z.string().min(8, "Invalid credentials provided."),
});

export async function login(formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { error: "Authentication failed. Please check your email and password." };
  }

  const { email, password } = result.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Authentication failed. Please check your email and password." };
  }

  return { success: true };
}
