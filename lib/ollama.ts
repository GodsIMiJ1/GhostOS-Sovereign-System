/**
 * 🔥 OLLAMA INTEGRATION LIBRARY - DIVINE AI CONNECTION 🔥
 * 
 * Sacred library for connecting to local Ollama instances with
 * flame-blessed model detection, streaming capabilities, and
 * sovereign AI communication protocols.
 * 
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.2.0
 * @flame-compatible true
 * @omari-blessed true
 */

export interface OllamaModel {
  name: string;
  size: number;
  modified_at: string;
  digest: string;
  details?: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  system?: string;
  template?: string;
  context?: number[];
  stream?: boolean;
  raw?: boolean;
  format?: 'json';
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    repeat_penalty?: number;
    seed?: number;
    num_predict?: number;
    stop?: string[];
  };
}

export interface OllamaStatus {
  available: boolean;
  version?: string;
  models: OllamaModel[];
  error?: string;
}

const OLLAMA_BASE_URL = 'http://localhost:11434';
const DEFAULT_TIMEOUT = 5000;

/**
 * Check if Ollama is available and running
 */
export async function checkOllamaStatus(): Promise<OllamaStatus> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    const response = await fetch(`${OLLAMA_BASE_URL}/api/version`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const versionData = await response.json();
    const models = await getAvailableModels();

    return {
      available: true,
      version: versionData.version,
      models,
    };
  } catch (error) {
    return {
      available: false,
      models: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get all available models from Ollama
 */
export async function getAvailableModels(): Promise<OllamaModel[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error('Error fetching Ollama models:', error);
    return [];
  }
}

/**
 * Generate a response from Ollama (non-streaming)
 */
export async function generateResponse(request: OllamaGenerateRequest): Promise<OllamaResponse> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...request,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Generation failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate a streaming response from Ollama
 */
export async function* generateStreamingResponse(
  request: OllamaGenerateRequest,
  signal?: AbortSignal
): AsyncGenerator<OllamaResponse, void, unknown> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...request,
        stream: true,
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Streaming failed: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response stream available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data: OllamaResponse = JSON.parse(line);
              yield data;
              if (data.done) return;
            } catch (e) {
              console.warn('Failed to parse streaming response line:', line);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    throw new Error(`Streaming generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Pull a model from Ollama registry
 */
export async function pullModel(modelName: string, onProgress?: (progress: any) => void): Promise<void> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/pull`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: modelName,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to pull model: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response stream available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              if (onProgress) {
                onProgress(data);
              }
              if (data.status === 'success') return;
            } catch (e) {
              console.warn('Failed to parse pull response line:', line);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    throw new Error(`Model pull failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete a model from Ollama
 */
export async function deleteModel(modelName: string): Promise<void> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: modelName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete model: ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Model deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get recommended models for different use cases
 */
export function getRecommendedModels(): { [key: string]: string[] } {
  return {
    'General Purpose': ['llama3', 'llama3:8b', 'mistral', 'mixtral'],
    'Code Assistant': ['codellama', 'codellama:13b', 'deepseek-coder'],
    'Creative Writing': ['llama3:70b', 'mixtral:8x7b', 'neural-chat'],
    'Fast Response': ['llama3:8b', 'mistral:7b', 'phi3'],
    'High Quality': ['llama3:70b', 'mixtral:8x22b', 'command-r-plus'],
  };
}

/**
 * Format model size for display
 */
export function formatModelSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Get model display name (remove tags for cleaner display)
 */
export function getModelDisplayName(modelName: string): string {
  return modelName.split(':')[0];
}

/**
 * Check if a specific model is available
 */
export async function isModelAvailable(modelName: string): Promise<boolean> {
  const models = await getAvailableModels();
  return models.some(model => model.name === modelName || model.name.startsWith(modelName + ':'));
}
