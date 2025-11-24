# Authentication Services

This directory contains authentication services organized by user role/prefix, following the architecture pattern from chemistry-subject-web.

## Structure

- **cms-auth.service.ts** - Authentication for CMS users (Admin, EVMStaff, EVMManager)
- **dealer-auth.service.ts** - Authentication for Dealer users (DealerManager, DealerStaff)
- **customer-auth.service.ts** - Authentication for Customer users (includes register functionality)
- **auth-service-factory.ts** - Factory to get the appropriate auth service based on role or prefix
- **index.ts** - Exports all auth services

## Usage

### Direct Service Usage

```typescript
import { cmsAuthService, dealerAuthService, customerAuthService } from '@/lib/api/auth'

// CMS Login
const { user, token } = await cmsAuthService.login({ username, password })

// Dealer Login
const { user, token } = await dealerAuthService.login({ username, password })

// Customer Register
const userDto = await customerAuthService.register({
  username,
  email,
  password,
  firstName,
  lastName,
})

// Customer Login
const { user, token } = await customerAuthService.login({ username, password })

// Refresh Token
const { token, refreshToken } = await cmsAuthService.refreshToken()

// Logout
await cmsAuthService.logout()
```

### Using Factory

```typescript
import { getAuthServiceByRole, getAuthServiceByPrefix } from '@/lib/api/auth/auth-service-factory'
import type { Role } from '@/lib/types'
import type { ApiPrefix } from '@/lib/types/enums'

// Get service by role
const userRole: Role = 'Admin'
const authService = getAuthServiceByRole(userRole)
await authService.login({ username, password })

// Get service by prefix
const prefix: ApiPrefix = 'cms'
const authService = getAuthServiceByPrefix(prefix)
await authService.login({ username, password })
```

## Role Mapping

- **CMS Prefix**: Admin, EVMStaff, EVMManager
- **Dealer Prefix**: DealerManager, DealerStaff
- **Customer Prefix**: Customer

## API Endpoints

All endpoints are defined in `@/lib/config/endpoints.ts`:

- CMS: `/api/cms/auth/login`, `/api/cms/auth/logout`, `/api/cms/auth/refresh-token`
- Dealer: Uses CMS auth endpoints (validates dealer roles)
- Customer: `/api/customer/auth/login`, `/api/customer/auth/register`, `/api/customer/auth/logout`, `/api/customer/auth/refresh-token`

## Token Storage

All services store tokens in localStorage:
- `evdms_auth_token` - Access token
- `evdms_refresh_token` - Refresh token

## Backward Compatibility

The legacy `authApi` in `@/lib/api/auth.ts` is still available but deprecated. It will route to the appropriate service based on the role parameter or try services in order (CMS → Customer → Dealer).

