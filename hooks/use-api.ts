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
    isLoading: enabled, // Start with loading state if enabled
    error: null,
  })

  // Use refs to track state and prevent re-creation
  const isRequestingRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)
  const apiCallRef = useRef(apiCall)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)

  // Update refs when values change (without causing re-renders)
  useEffect(() => {
    apiCallRef.current = apiCall
    onSuccessRef.current = onSuccess
    onErrorRef.current = onError
  }, [apiCall, onSuccess, onError])

  // Track mount state
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Track if initial request has been made for current apiCall/enabled combination
  const hasInitialRequestRef = useRef(false)
  const previousApiCallRef = useRef(apiCall)
  const enabledRef = useRef(enabled)
  enabledRef.current = enabled

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

    console.log('[useApi] Starting request...')
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const result = await apiCallRef.current()
      console.log('[useApi] Request successful, result:', result)

      // Always update state, even if component unmounted (for Strict Mode)
      // The component will handle cleanup if needed
      console.log('[useApi] Updating state with result, isMounted:', isMountedRef.current)
      setState({ data: result, isLoading: false, error: null })
      
      // Only call callbacks if still mounted
      if (isMountedRef.current && !abortControllerRef.current?.signal.aborted) {
        onSuccessRef.current?.(result)
      }
    } catch (error) {
      // Ignore abort errors
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('[useApi] Request aborted')
        return
      }

      const apiError = error instanceof Error ? error : new Error('Unknown error')
      console.error('[useApi] Request failed:', apiError, 'isMounted:', isMountedRef.current)
      
      // Always update state, even if component unmounted (for Strict Mode)
      setState((prev) => ({ ...prev, isLoading: false, error: apiError }))
      
      // Only call callbacks if still mounted
      if (isMountedRef.current && !abortControllerRef.current?.signal.aborted) {
        onErrorRef.current?.(apiError)
      }
    } finally {
      isRequestingRef.current = false
      console.log('[useApi] Request completed, isRequestingRef set to false')
    }
  }, []) // Empty deps - use refs instead

  const refetch = useCallback(async () => {
    await execute()
  }, [execute])

  useEffect(() => {
    if (!enabled) {
      hasInitialRequestRef.current = false
      return
    }

    // Check if apiCall function has changed - if so, reset and make new request
    const apiCallChanged = previousApiCallRef.current !== apiCall
    if (apiCallChanged) {
      console.log('[useApi] API call function changed, resetting request flag')
      previousApiCallRef.current = apiCall
      hasInitialRequestRef.current = false // Reset when apiCall changes
    }

    // Only make initial request once when enabled becomes true or apiCall changes
    if (!hasInitialRequestRef.current) {
      hasInitialRequestRef.current = true
      console.log('[useApi] Making initial request (enabled:', enabled, ', apiCall changed:', apiCallChanged, ')')
      execute()
    } else {
      console.log('[useApi] Skipping - initial request already made for this apiCall')
    }

    // Set up refetch interval if provided
    let intervalId: NodeJS.Timeout | null = null
    if (refetchInterval && refetchInterval > 0) {
      intervalId = setInterval(() => {
        execute()
      }, refetchInterval)
      intervalRef.current = intervalId
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      // Cancel ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Clear interval
      if (intervalId) {
        clearInterval(intervalId)
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      isRequestingRef.current = false
      // Don't reset hasInitialRequestRef here - let it reset when enabled or apiCall changes
    }
  }, [enabled, refetchInterval, apiCall, execute]) // Include apiCall and execute to detect changes

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

