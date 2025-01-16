import { Effect } from "effect"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export type AnyVoidFunction = (...args: any[]) => void
export type AnyAsyncVoidFunction = (...args: any[]) => Promise<void>
export type AnyAsyncFunction = (...args: any[]) => Promise<any>

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** A promise that never resolves */
export const eternity = new Promise(() => {})

/** Case-insensitive string equality */
export const eqCaseInsensitive: (a: string) => (b: string) => boolean =
  (a) => (b) => a.toLowerCase() === b.toLowerCase()

/** Debounce a function */
export const debounce = <Fn extends AnyVoidFunction>(fn: Fn, delayMs: number): Fn => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return ((...args: Parameters<Fn>) => {
    if (timeoutId !== undefined) clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      timeoutId = undefined
      fn(...args)
    }, delayMs)
  }) as Fn
}

/** Debounce an async function */
export const debounceAsync = <Fn extends (...args: any[]) => Promise<any>>(fn: Fn, delayMs: number): Fn => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let currentController: AbortController | undefined;

  return (async (...args: Parameters<Fn>) => {
    // If there's a pending timeout, clear it
    if (timeoutId !== undefined) clearTimeout(timeoutId);

    // If there's a pending request, abort it
    if (currentController !== undefined) currentController.abort();

    // Create a new AbortController for this request
    currentController = new AbortController();
    const { signal } = currentController;

    try {
      // Return a new promise that wraps our debounced call
      return await new Promise((resolve, reject) => {
        timeoutId = setTimeout(async () => {
          if (signal.aborted) await eternity;

          try {
            // Only proceed if we haven't been aborted
            if (!signal.aborted) {
              const result = await fn(...args);
              resolve(result);
            }
          } catch (error) {
            reject(error);
          } finally {
            // Clean up
            timeoutId = undefined;
            currentController = undefined;
          }
        }, delayMs);
      });
    } catch (error) {
      console.error('Error in debounceAsync:', error);
      throw error; // Re-throw any other errors
    }
  }) as Fn;
};



/** Execute an Effect synchronously, and fail typecheck if you haven't handled an error case */
export const runSyncSafe =
  <A>(...args: Parameters<typeof Effect.runSync<A, never>>) =>
    Effect.runSync<A, never>(...args)
