# API Services Documentation

Tài liệu này mô tả cách sử dụng các API services và hooks trong dự án.

## Cấu trúc

- **Base Hook**: `useApi` và `useApiMutation` - Quản lý lifecycle và tránh fetch trùng
- **API Services**: Các service functions để gọi API
- **Custom Hooks**: Hooks chuyên biệt cho từng module

## Tính năng chính

### 1. Tránh fetch trùng lặp
- Sử dụng `useRef` để track request đang chạy
- Tự động bỏ qua request trùng nếu đang có request tương tự

### 2. Quản lý lifecycle
- Tự động cleanup khi component unmount
- Hỗ trợ AbortController để cancel request
- Clear interval khi unmount

### 3. Error handling
- Tự động xử lý lỗi
- Callback `onSuccess` và `onError`
- Logging tự động

## Cách sử dụng

### Fetching Data

```typescript
import { useCustomers } from '@/hooks'

function CustomersList() {
  const { data, isLoading, error, refetch } = useCustomers({
    enabled: true,
    refetchInterval: 30000, // Refetch mỗi 30 giây
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data?.map(customer => (
        <div key={customer.id}>{customer.fullName}</div>
      ))}
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  )
}
```

### Conditional Fetching

```typescript
import { useCustomer } from '@/hooks'

function CustomerDetail({ customerId }: { customerId: string | null }) {
  const { data, isLoading } = useCustomer(customerId, {
    enabled: !!customerId, // Chỉ fetch khi có ID
  })

  if (!customerId) return <div>No customer selected</div>
  if (isLoading) return <div>Loading...</div>

  return <div>{data?.fullName}</div>
}
```

### Mutations

```typescript
import { useCreateCustomer } from '@/hooks'

function CreateCustomerForm() {
  const { mutate, isLoading, error } = useCreateCustomer()

  const handleSubmit = async (data: CreateCustomerRequest) => {
    try {
      await mutate(data)
      // Success - hook tự động gọi onSuccess callback
    } catch (error) {
      // Error - hook tự động gọi onError callback
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Customer'}
      </button>
    </form>
  )
}
```

### Với Parameters

```typescript
import { useOrders } from '@/hooks'

function OrdersList({ customerId }: { customerId?: string }) {
  const { data, isLoading } = useOrders(
    { customerId, status: OrderStatus.Pending },
    { enabled: true }
  )

  // ...
}
```

## API Services

### Customers
- `customersApi.getCustomers()`
- `customersApi.getCustomerById(id)`
- `customersApi.getCustomerHistory(id)`
- `customersApi.createCustomer(data)`
- `customersApi.updateCustomer(id, data)`

### Orders
- `ordersApi.getOrders(params?)`
- `ordersApi.getOrderById(id)`
- `ordersApi.createOrder(data)`
- `ordersApi.updateOrderStatus(id, data)`

### Quotations
- `quotationsApi.getQuotations(params?)`
- `quotationsApi.getQuotationById(id)`
- `quotationsApi.createQuotation(data)`

### Test Drives
- `testDrivesApi.getTestDrives(params?)`
- `testDrivesApi.createTestDrive(data)`
- `testDrivesApi.updateTestDriveStatus(id, data)`

### Payments
- `paymentsApi.getPaymentsByOrder(orderId)`
- `paymentsApi.createPayment(data)`
- `paymentsApi.createInstallmentPlan(data)`

### Vehicle Requests
- `vehicleRequestsApi.getVehicleRequests()`
- `vehicleRequestsApi.createVehicleRequest(data)`

## Best Practices

1. **Luôn sử dụng hooks thay vì gọi API trực tiếp** - Để có lifecycle management
2. **Sử dụng `enabled` option** - Để control khi nào fetch data
3. **Sử dụng `refetchInterval`** - Cho data cần real-time update
4. **Handle loading và error states** - Luôn check `isLoading` và `error`
5. **Sử dụng `refetch`** - Khi cần refresh data manually

## Lifecycle Management

Hooks tự động:
- ✅ Cancel request khi component unmount
- ✅ Clear interval khi unmount
- ✅ Prevent duplicate requests
- ✅ Handle AbortController

Bạn không cần phải tự cleanup!

