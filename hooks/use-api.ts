/**
 * Base hook for API calls with lifecycle management
 * Prevents duplicate requests using useRef
 * Handles cleanup on unmount
 */

import { useRef, useEffect, useCallback, useState } from 'react'

interface UseApiOptions<T> {
  enabled?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  refetchInterval?: number
}

interface UseApiState<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
}

/**
 * Base hook for API calls with duplicate prevention
 */
export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiState<T> & { refetch: () => Promise<void> } {
  const { enabled = true, onSuccess, onError, refetchInterval } = options

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  })

  // Use ref to track if request is in progress
  const isRequestingRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const execute = useCallback(async () => {
    // Prevent duplicate requests
    if (isRequestingRef.current) {
      console.warn('[useApi] Request already in progress, skipping duplicate call')
      return
    }

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()
    isRequestingRef.current = true

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const result = await apiCall()

      // Check if component is still mounted
      if (abortControllerRef.current?.signal.aborted) {
        return
      }

      setState({ data: result, isLoading: false, error: null })
      onSuccess?.(result)
    } catch (error) {
      // Ignore abort errors
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }

      // Check if component is still mounted
      if (abortControllerRef.current?.signal.aborted) {
        return
      }

      const apiError = error instanceof Error ? error : new Error('Unknown error')
      setState((prev) => ({ ...prev, isLoading: false, error: apiError }))
      onError?.(apiError)
    } finally {
      isRequestingRef.current = false
    }
  }, [apiCall, onSuccess, onError])

  const refetch = useCallback(async () => {
    await execute()
  }, [execute])

  useEffect(() => {
    if (!enabled) {
      return
    }

    // Initial fetch
    execute()

    // Set up refetch interval if provided
    if (refetchInterval && refetchInterval > 0) {
      intervalRef.current = setInterval(() => {
        execute()
      }, refetchInterval)
    }

    // Cleanup on unmount
    return () => {
      // Cancel ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Clear interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      isRequestingRef.current = false
    }
  }, [enabled, execute, refetchInterval])

  return {
    ...state,
    refetch,
  }
}

/**
 * Hook for API mutations (POST, PUT, DELETE)
 */
export function useApiMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData) => void
    onError?: (error: Error) => void
  } = {}
) {
  const { onSuccess, onError } = options

  const [state, setState] = useState<{
    data: TData | null
    isLoading: boolean
    error: Error | null
  }>({
    data: null,
    isLoading: false,
    error: null,
  })

  const isRequestingRef = useRef(false)

  const mutate = useCallback(
    async (variables: TVariables) => {
      // Prevent duplicate requests
      if (isRequestingRef.current) {
        console.warn('[useApiMutation] Request already in progress, skipping duplicate call')
        return
      }

      isRequestingRef.current = true
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const result = await mutationFn(variables)
        setState({ data: result, isLoading: false, error: null })
        onSuccess?.(result)
        return result
      } catch (error) {
        const apiError = error instanceof Error ? error : new Error('Unknown error')
        setState((prev) => ({ ...prev, isLoading: false, error: apiError }))
        onError?.(apiError)
        throw apiError
      } finally {
        isRequestingRef.current = false
      }
    },
    [mutationFn, onSuccess, onError]
  )

  return {
    ...state,
    mutate,
  }
}

