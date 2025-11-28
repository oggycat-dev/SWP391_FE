/**
 * Custom hooks for Test Drives
 */

import { useApi, useApiMutation } from './use-api'
import {
  testDrivesApi,
  type TestDriveDto,
  type CreateTestDriveRequest,
  type UpdateTestDriveStatusRequest,
  type GetTestDrivesParams,
  type PaginatedResult,
} from '@/lib/api/test-drives'

export function useTestDrives(
  params?: GetTestDrivesParams,
  options?: { enabled?: boolean; refetchInterval?: number }
) {
  const { enabled = true, refetchInterval } = options || {}

  return useApi(
    () => testDrivesApi.getTestDrives(params),
    {
      enabled,
      refetchInterval,
    }
  )
}

export function useCreateTestDrive() {
  return useApiMutation<TestDriveDto, CreateTestDriveRequest>(
    (data) => testDrivesApi.createTestDrive(data),
    {
      onSuccess: () => console.log('[useCreateTestDrive] Test drive created successfully'),
      onError: (error) => console.error('[useCreateTestDrive] Failed:', error),
    }
  )
}

export function useUpdateTestDriveStatus() {
  return useApiMutation<TestDriveDto, { id: string; data: UpdateTestDriveStatusRequest }>(
    ({ id, data }) => testDrivesApi.updateTestDriveStatus(id, data),
    {
      onSuccess: () => console.log('[useUpdateTestDriveStatus] Status updated successfully'),
      onError: (error) => console.error('[useUpdateTestDriveStatus] Failed:', error),
    }
  )
}

