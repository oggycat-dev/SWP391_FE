# Test Accounts (Mock Login)

Since the backend is currently offline, you can use these mock accounts to test the login functionality.

## Available Test Accounts

### 1. Admin Account
- **Username:** `admin@evm.com`
- **Password:** `Admin@123`
- **Role:** Admin
- **Permissions:** Full system access

### 2. EVM Staff Account
- **Username:** `evmstaff@evm.com`
- **Password:** `Staff@123`
- **Role:** EVMStaff
- **Permissions:**
  - Manage vehicles and inventory
  - Approve vehicle requests from dealers
  - View reports by region
  - Manage promotions and discounts

### 3. Dealer Manager Account
- **Username:** `dealermanager@dealer.com`
- **Password:** `Manager@123`
- **Role:** DealerManager
- **Permissions:**
  - All Dealer Staff permissions
  - Approve large quotations and orders
  - View dealer-wide sales reports
  - Manage dealer staff
  - Handle customer complaints

### 4. Dealer Staff Account
- **Username:** `dealerstaff@dealer.com`
- **Password:** `Staff@123`
- **Role:** DealerStaff
- **Permissions:**
  - View vehicle catalog and prices
  - Create/Edit customer profiles
  - Schedule test drives
  - Create quotations and orders
  - View dealer inventory
  - Request vehicles from EVM
  - View personal sales

## Usage

1. Go to the login page: `http://localhost:3000/login`
2. Enter one of the usernames and passwords above
3. Click "Sign In"
4. You will be redirected to the dashboard with role-based access

## Notes

- These are mock accounts that work without backend connection
- Mock authentication creates a temporary JWT token stored in localStorage
- Token expires after 24 hours
- When backend is online, remove the mock login logic from `lib/api/auth/cms-auth.service.ts`
