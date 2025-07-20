import { createOpenAIClient } from "./client";
import { OPENAI_CONFIG } from "@/lib/constants";

/**
 * Determines if a model should use the Responses API instead of Chat Completions API
 * @param model - The model name
 * @returns boolean - True if model should use Responses API
 */
export const shouldUseResponsesAPI = (model: string): boolean => {
  // O3 models may work better with Responses API
  return model.includes('o3') || model.includes('o4');
};

/**
 * Makes an API call using the Responses API
 * @param openai - OpenAI client instance
 * @param params - API call parameters (similar to chat completions but for responses)
 * @returns Promise<any> - Response from Responses API
 */
export const makeResponsesAPICall = async (
  openai: any,
  params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    max_tokens?: number;
    temperature?: number;
  }
): Promise<any> => {
  // Convert chat completions format to responses format
  const systemMessage = params.messages.find(m => m.role === 'system');
  const userMessage = params.messages.find(m => m.role === 'user');
  
  const responsesParams = {
    model: params.model,
    instructions: systemMessage?.content || "You are a helpful assistant.",
    input: userMessage?.content || "",
    max_tokens: params.max_tokens,
    temperature: params.temperature,
    // Enable reasoning summary for o3 models
    ...(params.model.includes('o3') && { reasoning_summary: 'auto' })
  };

  return await openai.responses.create(responsesParams);
};

/**
 * Enhanced API call function that tries Responses API first for o3 models,
 * then falls back to Chat Completions API
 * @param openai - OpenAI client instance
 * @param params - API call parameters
 * @returns Promise<any> - API response
 */
export const makeEnhancedOpenAICall = async (
  openai: any,
  params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    max_tokens?: number;
    temperature?: number;
  }
): Promise<any> => {
  // Try Responses API first for o3 models
  if (shouldUseResponsesAPI(params.model)) {
    try {
      console.log(`Trying Responses API for model: ${params.model}`);
      const response = await makeResponsesAPICall(openai, params);
      
      // Convert responses format back to chat completions format for compatibility
      return {
        choices: [{
          message: {
            content: response.content || response.output || ""
          }
        }]
      };
    } catch (error: any) {
      console.warn(`Responses API failed for ${params.model}, trying Chat Completions API:`, error.message);
      
      // Fall back to Chat Completions API
      try {
        return await openai.chat.completions.create(params);
      } catch (chatError: any) {
        // If both APIs fail, try with default model
        if (chatError?.error?.code === 'model_not_found' || chatError?.status === 404) {
          console.warn(`Both APIs failed for ${params.model}. Falling back to ${OPENAI_CONFIG.DEFAULT_MODEL}`);
          return await openai.chat.completions.create({
            ...params,
            model: OPENAI_CONFIG.DEFAULT_MODEL
          });
        }
        throw chatError;
      }
    }
  }

  // For non-o3 models, use standard Chat Completions API with fallback
  try {
    return await openai.chat.completions.create(params);
  } catch (error: any) {
    if (error?.error?.code === 'model_not_found' || error?.status === 404) {
      console.warn(`Model ${params.model} not accessible. Falling back to ${OPENAI_CONFIG.DEFAULT_MODEL}`);
      return await openai.chat.completions.create({
        ...params,
        model: OPENAI_CONFIG.DEFAULT_MODEL
      });
    }
    throw error;
  }
};
