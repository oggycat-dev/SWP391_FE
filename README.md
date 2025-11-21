# EV Dealer Management System - Frontend

A modern dealer management system built with Next.js 16 for electric vehicle dealerships.

## Features

- 🔐 Authentication & Authorization
- 📊 Dashboard with KPIs
- 🚗 Vehicle Management
- 👥 Customer Management
- 📦 Order Management
- 🎫 Promotions & Discounts
- 🚙 Test Drive Scheduling
- 📈 Reports & Analytics

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Context
- **API Client**: Fetch API

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.local.example .env.local

# Update API URL in .env.local
NEXT_PUBLIC_API_URL=http://localhost:5001/api

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_API_TIMEOUT=30000
```

## Project Structure

```
dealer-management-system/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── auth/             # Auth components
│   ├── layout/           # Layout components
│   ├── ui/               # UI components
│   └── vehicles/         # Vehicle components
├── lib/                   # Utilities
│   ├── api/              # API clients
│   ├── config/           # Configuration
│   └── types/            # TypeScript types
└── public/               # Static assets
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Demo Credentials

For testing with mock backend:
- Email: `admin@cleanarchitecture.com`
- Password: `Admin@123456`

## License

MIT
