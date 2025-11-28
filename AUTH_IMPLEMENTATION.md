# Authentication & Token Management

## ✅ Tính năng đã implement

### 1. **Auto Refresh Token khi token hết hạn**

**Cách hoạt động:**
- Khi API trả về lỗi 401 (Unauthorized), `apiClient` sẽ tự động:
  1. Detect lỗi 401
  2. Gọi API refresh token (`/api/cms/auth/refresh-token`, `/api/dealer/auth/refresh-token`, hoặc `/api/customer/auth/refresh-token` tùy role)
  3. Lưu token mới vào localStorage
  4. Retry request ban đầu với token mới
  5. Nếu refresh token cũng fail → Tự động logout và redirect về `/login`

**Đặc điểm:**
- ✅ Tự động detect endpoint dựa trên role (CMS/Dealer/Customer)
- ✅ Queue các requests khi đang refresh (tránh race condition)
- ✅ Prevent infinite retry loop
- ✅ Transparent cho developer (không cần xử lý thủ công)

**Code location:**
- `lib/api/client.ts` - ApiClient class với refresh logic

**Test:**
1. Login vào hệ thống
2. Đợi token expire (hoặc manually set expired token)
3. Thực hiện bất kỳ API call nào
4. Token sẽ tự động được refresh và request thành công

---

### 2. **Auto redirect đến login khi chưa đăng nhập**

**Cách hoạt động:**

#### A. Next.js Middleware (Server-side)
- Check token trước khi render page
- Protected routes: `/dashboard/*`
- Auth routes: `/login`, `/register`
- Tự động redirect:
  - `/dashboard` + no token → `/login?redirect=/dashboard`
  - `/login` + has token → `/dashboard`

**Code location:**
- `middleware.ts` - Next.js Edge Middleware

#### B. AuthProvider (Client-side)
- Validate token khi app mount
- Check JWT expiration
- Restore user session từ localStorage
- Auto logout nếu token invalid

**Code location:**
- `components/auth/auth-provider.tsx`

#### C. Token Sync
- Sync token từ localStorage → cookie (cho middleware)
- Listen storage changes (multi-tab support)
- Auto clear cookie khi logout

**Code location:**
- `components/auth/token-sync.tsx`

---

## 🔐 Security Features

### Token Storage
- **Access Token**: 
  - localStorage: `evdms_auth_token`
  - Cookie: `evdms_auth_token` (cho middleware)
  - Expires: 7 days
  
- **Refresh Token**: 
  - localStorage: `evdms_refresh_token`
  - Backend handles: 7 days

- **User Data**: 
  - localStorage: `evdms_user` (JSON)

### Protected Routes
Middleware tự động protect tất cả routes bắt đầu với:
- `/dashboard/*` - Cần authentication
- Các route khác có thể access công khai

### Logout Flow
1. Gọi backend logout API
2. Clear localStorage tokens
3. Clear cookie
4. Reset user state
5. Redirect về `/login`

---

## 📝 Usage Examples

### API Client sẽ tự động handle refresh:

```typescript
// Không cần xử lý refresh token thủ công
const dealers = await dealersApi.getDealers()
// Nếu token hết hạn, sẽ tự động refresh và retry
```

### Protected Page:

```typescript
// middleware.ts đã protect, không cần thêm code
export default function DashboardPage() {
  // User đã authenticated nếu vào được đây
  return <div>Dashboard</div>
}
```

### Manual Logout:

```typescript
import { useAuth } from '@/components/auth/auth-provider'

function LogoutButton() {
  const { logout } = useAuth()
  
  return (
    <button onClick={logout}>
      Logout
    </button>
  )
}
```

---

## 🧪 Testing Guide

### Test Auto Refresh Token:
1. Login với any role
2. Open DevTools → Application → Local Storage
3. Copy `evdms_auth_token` value
4. Decode JWT tại jwt.io, xem `exp` field
5. Manually change `exp` to past time hoặc đợi token expire
6. Thực hiện bất kỳ API call (click vào dealers, users, etc.)
7. Check Network tab → Sẽ thấy request refresh-token
8. Original request sẽ retry với token mới

### Test Route Protection:
1. Logout khỏi hệ thống
2. Manually navigate đến `/dashboard` trong URL bar
3. Sẽ tự động redirect về `/login?redirect=/dashboard`
4. Login thành công → redirect về `/dashboard`

### Test Multi-tab Logout:
1. Mở 2 tabs cùng login
2. Logout ở tab 1
3. Tab 2 sẽ tự động detect và sync state (via storage event)

---

## 🔧 Configuration

### Thay đổi protected routes:

Edit `middleware.ts`:
```typescript
const protectedRoutes = [
  '/dashboard',
  '/admin',      // Add more
  '/settings'    // Add more
]
```

### Thay đổi token expiration:

Edit `components/auth/auth-provider.tsx`:
```typescript
// Change cookie expiration
expires.setDate(expires.getDate() + 30) // 30 days
```

---

## 🐛 Troubleshooting

### Token không tự động refresh:
- Check Network tab: Có call `/refresh-token` không?
- Check Console: Có error log không?
- Verify `evdms_refresh_token` tồn tại trong localStorage

### Vẫn bị redirect về login dù đã login:
- Check cookie `evdms_auth_token` có tồn tại không?
- Check `TokenSync` component đã mount chưa
- Hard refresh browser (Ctrl+Shift+R)

### Multi-tab không sync:
- Check browser storage events có hoạt động không
- Test trong normal window (không phải incognito)

---

## 📚 Architecture

```
User Request
    ↓
middleware.ts (Server-side check cookie)
    ↓
AuthProvider (Client-side restore session)
    ↓
TokenSync (Sync localStorage ↔ cookie)
    ↓
Protected Page/Component
    ↓
API Call via apiClient
    ↓
401 Error? → Auto refresh token → Retry
```

---

## ✨ Benefits

1. **User Experience**: Token tự động refresh, không bị logout giữa chừng
2. **Security**: Token stored securely, auto expire handling
3. **Developer Experience**: Transparent auto-refresh, không cần xử lý thủ công
4. **Multi-tab Support**: Logout ở 1 tab, all tabs sync
5. **SEO Friendly**: Server-side redirect via middleware
