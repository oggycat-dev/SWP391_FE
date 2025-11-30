/**
 * Users API Service (CMS - Admin Only)
 * Handles all user management API calls
 * Only accessible by Admin role
 */

import { apiClient } from './client'
import { USER_ENDPOINTS } from '@/lib/config/endpoints'
import type { PaginatedResult } from './vehicles'

// ============================================================================
// Types - User DTOs
// ============================================================================

export interface UserDto {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  role: number | string // UserRole enum value (0, 1, 3, 4, 5) or string
  dealerId?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface CreateUserRequest {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
  role: string
}

export interface UpdateUserRequest {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  role: number // UserRole enum value (0-5, excluding 2)
  isActive: boolean
}

export interface GetUsersParams {
  role?: string
  search?: string
  isActive?: boolean
  page?: number
  pageSize?: number
}

// ============================================================================
// API Services
// ============================================================================

export const usersApi = {
  /**
   * Get all users with pagination (Admin only)
   */
  getUsers: async (
    params?: GetUsersParams,
    signal?: AbortSignal
  ): Promise<PaginatedResult<UserDto>> => {
    const queryParams: Record<string, string> = {}
    if (params?.role) queryParams.role = params.role
    if (params?.search) queryParams.search = params.search
    if (params?.isActive !== undefined) queryParams.isActive = String(params.isActive)
    if (params?.page) queryParams.page = String(params.page)
    if (params?.pageSize) queryParams.pageSize = String(params.pageSize)

    return apiClient.get<PaginatedResult<UserDto>>(
      USER_ENDPOINTS.CMS.BASE,
      queryParams,
      signal
    )
  },

  /**
   * Get user by ID (Admin only)
   */
  getUserById: async (id: string, signal?: AbortSignal): Promise<UserDto> => {
    return apiClient.get<UserDto>(USER_ENDPOINTS.CMS.BY_ID(id), undefined, signal)
  },

  /**
   * Create a new user (Admin only)
   */
  createUser: async (data: CreateUserRequest, signal?: AbortSignal): Promise<UserDto> => {
    return apiClient.post<UserDto>(USER_ENDPOINTS.CMS.BASE, data, signal)
  },

  /**
   * Update an existing user (Admin only)
   */
  updateUser: async (
    id: string,
    data: Omit<UpdateUserRequest, 'id'>,
    signal?: AbortSignal
  ): Promise<UserDto> => {
    return apiClient.put<UserDto>(USER_ENDPOINTS.CMS.BY_ID(id), { id, ...data }, signal)
  },

  /**
   * Delete a user (soft delete) (Admin only)
   */
  deleteUser: async (id: string, signal?: AbortSignal): Promise<void> => {
    return apiClient.delete<void>(USER_ENDPOINTS.CMS.BY_ID(id), signal)
  },
}

