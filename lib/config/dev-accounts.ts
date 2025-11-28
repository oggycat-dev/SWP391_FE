/**
 * Development Configuration
 * Default admin credentials matching backend seed data
 * Only available in development mode
 */

export const DEV_ACCOUNTS = {
  admin: {
    username: 'admin',
    password: 'Admin@123456',
    role: 'Admin',
  },
  evmStaff: {
    username: 'evmstaff',
    password: 'Staff@123456',
    role: 'EVMStaff',
  },
  evmManager: {
    username: 'evmmanager',
    password: 'Manager@123456',
    role: 'EVMManager',
  },
  dealerManager: {
    username: 'dealermanager',
    password: 'Dealer@123456',
    role: 'DealerManager',
  },
  dealerStaff: {
    username: 'dealerstaff',
    password: 'Staff@123456',
    role: 'DealerStaff',
  },
}

// Log accounts in console for development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔑 Dev Accounts Available:')
  console.table(DEV_ACCOUNTS)
  console.log('Use these credentials to login in development mode')
}
