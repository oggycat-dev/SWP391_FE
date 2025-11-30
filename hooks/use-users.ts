/**
 * Custom hooks for Users (Admin only)
 * Manages lifecycle and prevents duplicate API calls
 */

import { useCallback, useMemo, useRef } from 'react'
import { useApi, useApiMutation } from './use-api'
import {
  usersApi,
  type UserDto,
  type CreateUserRequest,
  type UpdateUserRequest,
  type GetUsersParams,
} from '@/lib/api/users'
import type { PaginatedResult } from '@/lib/api/vehicles'

/**
 * Hook to fetch all users with pagination
 */
export function useUsers(
  params?: GetUsersParams,
  options?: { enabled?: boolean; refetchInterval?: number }
) {
  const { enabled = true, refetchInterval } = options || {}
  
  // Memoize params to prevent creating new object on every render
  const paramsRef = useRef(params)
  paramsRef.current = params

  // Memoize the API call function to prevent re-creation
  const apiCall = useCallback(
    () => usersApi.getUsers(paramsRef.current),
    [] // Empty deps - use ref for params
  )

  return useApi(apiCall, {
    enabled,
    refetchInterval,
  })
}

/**
 * Hook to fetch a single user by ID
 * Memoizes API call to prevent duplicate requests
 */
export function useUser(id: string | null, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {}
  
  // Use ref to store id and prevent re-creation of apiCall
  const idRef = useRef(id)
  idRef.current = id
  
  // Memoize the API call function - only recreate when id changes
  // This ensures useApi can track unique requests properly
  const apiCall = useCallback(
    () => {
      const currentId = idRef.current
      if (!currentId) throw new Error('User ID is required')
      console.log('[useUser] API call for user ID:', currentId)
      return usersApi.getUserById(currentId)
    },
    [id] // Include id so apiCall changes when id changes, allowing useApi to track new requests
  )

  return useApi(apiCall, {
    enabled: enabled && !!id,
  })
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  return useApiMutation<UserDto, CreateUserRequest>(
    (data) => usersApi.createUser(data),
    {
      onSuccess: () => {
        console.log('[useCreateUser] User created successfully')
      },
      onError: (error) => {
        console.error('[useCreateUser] Failed to create user:', error)
      },
    }
  )
}

/**
 * Hook to update a user
 */
export function useUpdateUser() {
  return useApiMutation<UserDto, { id: string; data: Omit<UpdateUserRequest, 'id'> }>(
    ({ id, data }) => usersApi.updateUser(id, data),
    {
      onSuccess: () => {
        console.log('[useUpdateUser] User updated successfully')
      },
      onError: (error) => {
        console.error('[useUpdateUser] Failed to update user:', error)
      },
    }
  )
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  return useApiMutation<void, string>(
    (id) => usersApi.deleteUser(id),
    {
      onSuccess: () => {
        console.log('[useDeleteUser] User deleted successfully')
      },
      onError: (error) => {
        console.error('[useDeleteUser] Failed to delete user:', error)
      },
    }
  )
}

