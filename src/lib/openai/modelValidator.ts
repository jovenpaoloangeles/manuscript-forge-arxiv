import { createOpenAIClient } from "./client";
import { OPENAI_CONFIG } from "@/lib/constants";

/**
 * Validates if a model is accessible with the given API key
 * @param model - The model name to validate
 * @param apiKey - The OpenAI API key
 * @returns Promise<boolean> - True if model is accessible, false otherwise
 */
export const validateModelAccess = async (model: string, apiKey: string): Promise<boolean> => {
  try {
    const openai = createOpenAIClient(apiKey);
    
    // Make a minimal test request to check model access
    await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: "test" }],
      max_tokens: 1,
      temperature: 0
    });
    
    return true;
  } catch (error: any) {
    // Model not found or access denied
    if (error?.error?.code === 'model_not_found' || error?.status === 404) {
      console.warn(`Model ${model} is not accessible with current API key`);
      return false;
    }
    
    // Other errors might be temporary, so we'll assume the model is valid
    console.warn(`Error validating model ${model}:`, error.message);
    return true;
  }
};

/**
 * Gets the best available model, falling back to default if selected model is not accessible
 * @param selectedModel - The preferred model
 * @param apiKey - The OpenAI API key
 * @returns Promise<string> - The model name to use
 */
export const getBestAvailableModel = async (selectedModel: string, apiKey: string): Promise<string> => {
  const isAccessible = await validateModelAccess(selectedModel, apiKey);
  
  if (isAccessible) {
    return selectedModel;
  }
  
  // Fall back to default model
  console.info(`Falling back to ${OPENAI_CONFIG.DEFAULT_MODEL} due to access restrictions`);
  return OPENAI_CONFIG.DEFAULT_MODEL;
};
