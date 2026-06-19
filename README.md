# Multi-Vendor Service Marketplace Platform

A full-stack Next.js marketplace application connecting service providers with customers for home services like cleaning, plumbing, electrical work, and more.

---

## 🏗️ Project Architecture

This is a **full-stack monolithic application** built with Next.js 14, where frontend and backend coexist in a unified codebase.

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript 5
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod validation
- **State Management:** React Server Components + NextAuth session

### Backend

- **Runtime:** Node.js
- **API:** Next.js API Routes
- **Authentication:** NextAuth.js v4 (JWT strategy)
- **Password Hashing:** bcryptjs
- **Authorization:** Role-Based Access Control (RBAC)

### Database

- **Database:** SQLite (development)
- **ORM:** Prisma 5.22.0
- **Migrations:** Prisma Migrate

### Payment

- **Gateway:** Stripe (sandbox/test mode)
- **Processing:** Mock simulation (no real transactions)

---

## ✨ Features

### Authentication & Authorization

- ✅ Secure login/registration with bcrypt password hashing
- ✅ JWT-based session management
- ✅ Three user roles: Admin, Vendor, End-User
- ✅ Role-based dashboard access
- ✅ Protected routes with middleware

### User Features

- ✅ Browse services by category
- ✅ Filter and sort services (price, name)
- ✅ Book services with mock checkout
- ✅ View order history
- ✅ Edit profile (name, phone, address)

### Vendor Features

- ✅ Dedicated vendor dashboard
- ✅ Create, edit, and delete services
- ✅ Manage service pricing
- ✅ View received orders
- ✅ Track revenue and statistics

### Admin Features

- ✅ Create new users, vendors, and admins
- ✅ View all users and their roles
- ✅ Platform-wide statistics
- ✅ Category management (via seed)

### Marketplace

- ✅ Searchable service catalog
- ✅ Category-based filtering
- ✅ Price and name sorting
- ✅ Responsive card-based layout
- ✅ Vendor information display

### Payment Processing

- ✅ Complete checkout flow
- ✅ Mock Stripe payment integration (test mode)
- ✅ Order and payment record creation
- ✅ Transaction tracking
- ✅ Order status management

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** 9.x or higher (or yarn/pnpm)
- **Git** (for cloning the repository)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/marketplace-platform.git
cd marketplace-platform

Install Dependencies

npm install


Generate a secure random string for NEXTAUTH_SECRET:
openssl rand -base64 32

Database Setup
Generate Prisma client and create the database:

npx prisma generate
npx prisma db push


Seed the Database

npx prisma db seed


Start Development Server

npm run dev

The application will be available at http://localhost:3000

Default Login Credentials
Admin Account
Email: admin@marketplace.com
Password: admin123

Vendor Accounts
1. John's Home Services
   Email: john@services.com
   Password: vendor123

2. Sparkle Clean Co
   Email: sarah@clean.com
   Password: vendor123

3. Swift Movers
   Email: mike@movers.com
   Password: vendor123

4. Elite Interiors
   Email: lisa@decor.com
   Password: vendor123
```
