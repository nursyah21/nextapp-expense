import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import argon2 from "argon2";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json())

export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password); 
}

export async function verifyPassword(password: string, hashPassword: string): Promise<boolean> {
  return await argon2.verify(hashPassword, password); 
}
