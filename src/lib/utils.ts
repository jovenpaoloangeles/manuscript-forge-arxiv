import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { STORAGE_KEYS, OPENAI_CONFIG } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSelectedModel(): string {
  const storedModel = localStorage.getItem(STORAGE_KEYS.OPENAI_MODEL);
  return storedModel || OPENAI_CONFIG.DEFAULT_MODEL;
}

export function setSelectedModel(model: string): void {
  localStorage.setItem(STORAGE_KEYS.OPENAI_MODEL, model);
}
