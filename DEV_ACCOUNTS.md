# Development Test Accounts

## Default Admin Account

Matching backend seed data from `env.example`:

```
Username: admin
Password: Admin@123456
Email: admin@cleanarchitecture.com
Role: Admin
```

## Other Test Accounts

### EVM Staff
```
Username: evmstaff
Password: Staff@123456
Role: EVMStaff
```

### EVM Manager
```
Username: evmmanager
Password: Manager@123456
Role: EVMManager
```

### Dealer Manager
```
Username: dealermanager
Password: Dealer@123456
Role: DealerManager
```

### Dealer Staff
```
Username: dealerstaff
Password: Staff@123456
Role: DealerStaff
```

## Usage

1. Start backend server (port 5001)
2. Navigate to `http://localhost:3000/login`
3. In development mode, you'll see admin credentials displayed
4. Use any account above to test different role permissions

## Console Access

In browser console (development only):
```javascript
// View all dev accounts
console.table(DEV_ACCOUNTS)
```

## Note

⚠️ These credentials are for **development only** and match the backend seed data.
Do NOT use in production!
