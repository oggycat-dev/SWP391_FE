/**
 * Test Drives API Service
 * Handles all test drive-related API calls for Dealer
 */

import { apiClient } from './client'
import { getCurrentApiPrefix } from '@/lib/utils/api-prefix'
import type { PaginatedResult } from './vehicles'

export enum TestDriveStatus {
  Scheduled = 'Scheduled',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  NoShow = 'NoShow',
}

export interface TestDriveDto {
  id: string
  customerId: string
  vehicleId: string
  scheduledDate: string
  scheduledTime: string
  status: TestDriveStatus
  notes?: string
  dealerId: string
  createdAt: string
  updatedAt?: string
}

export interface CreateTestDriveRequest {
  customerId: string
  vehicleId: string
  scheduledDate: string
  scheduledTime: string
  notes?: string
}

export interface UpdateTestDriveStatusRequest {
  id: string
  status: TestDriveStatus
  notes?: string
}

export interface GetTestDrivesParams {
  customerId?: string
  status?: TestDriveStatus
  page?: number
  pageSize?: number
}

// PaginatedResult is exported from vehicles.ts

export const testDrivesApi = {
  /**
   * Get all test drives (paginated)
   */
  getTestDrives: async (
    params?: GetTestDrivesParams,
    signal?: AbortSignal
  ): Promise<PaginatedResult<TestDriveDto>> => {
    const queryParams: Record<string, string> = {}
    if (params?.customerId) queryParams.customerId = params.customerId
    if (params?.status) queryParams.status = params.status
    if (params?.page) queryParams.page = String(params.page)
    if (params?.pageSize) queryParams.pageSize = String(params.pageSize)

    const prefix = getCurrentApiPrefix()
    const endpoint = `/api/${prefix}/test-drives`
    return apiClient.get<PaginatedResult<TestDriveDto>>(endpoint, queryParams, signal)
  },

  /**
   * Create new test drive
   */
  createTestDrive: async (data: CreateTestDriveRequest, signal?: AbortSignal): Promise<TestDriveDto> => {
    const prefix = getCurrentApiPrefix()
    const endpoint = `/api/${prefix}/test-drives`
    return apiClient.post<TestDriveDto>(endpoint, data, signal)
  },

  /**
   * Update test drive status
   */
  updateTestDriveStatus: async (
    id: string,
    data: UpdateTestDriveStatusRequest,
    signal?: AbortSignal
  ): Promise<TestDriveDto> => {
    const prefix = getCurrentApiPrefix()
    const endpoint = `/api/${prefix}/test-drives/${id}/status`
    return apiClient.put<TestDriveDto>(endpoint, data, signal)
  },
}

