import type { ApiNodeType } from '../types/pipeline';

/**
 * Base URL for the API
 * Uses VITE_API_BASE_URL environment variable, defaults to http://localhost:8000
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status?: number;
  statusText?: string;

  constructor(message: string, status?: number, statusText?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

/**
 * Options for fetchNodeTypes function
 */
export interface FetchNodeTypesOptions {
  /**
   * Number of retry attempts on failure (default: 3)
   */
  retries?: number;
  /**
   * Delay between retries in milliseconds (default: 1000)
   */
  retryDelay?: number;
}

/**
 * Fetches node types from the API
 *
 * @param options - Configuration options for the fetch operation
 * @returns Promise that resolves to an array of ApiNodeType
 * @throws {ApiError} If the API request fails after all retries
 *
 * @example
 * ```ts
 * try {
 *   const nodeTypes = await fetchNodeTypes();
 *   console.log('Node types:', nodeTypes);
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     console.error('API error:', error.message);
 *   }
 * }
 * ```
 */
export const fetchNodeTypes = async (
  options: FetchNodeTypesOptions = {}
): Promise<ApiNodeType[]> => {
  const { retries = 2, retryDelay = 1000 } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/nodes`);

      if (!response.ok) {
        throw new ApiError(
          `Failed to fetch node types: ${response.statusText}`,
          response.status,
          response.statusText
        );
      }

      const data: ApiNodeType[] = await response.json();

      // Validate response structure
      if (!Array.isArray(data)) {
        throw new ApiError(
          'Invalid response format: expected an array',
          response.status
        );
      }

      return data;
    } catch (error) {
      lastError =
        error instanceof ApiError
          ? error
          : new ApiError(
              error instanceof Error ? error.message : 'Unknown error occurred'
            );

      // Don't retry on the last attempt
      if (attempt < retries) {
        // Wait before retrying (exponential backoff)
        const delay = retryDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  // If we get here, all retries failed
  throw lastError || new ApiError('Failed to fetch node types after retries');
};
