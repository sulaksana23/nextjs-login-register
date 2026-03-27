# Next.js 16 Authentication with Prisma 7 & Tailwind CSS v4

A modern, high-performance authentication system built with the latest technologies. This project features a robust registration and login flow, integrated with a PostgreSQL database using Prisma 7's new adapter architecture.

![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Prisma 7](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql)

## 🚀 Features

- **Authentication**: Secure registration and login using Next.js Server Actions.
- **Session Management**: Secure, HTTP-only cookie-based sessions.
- **Prisma 7**: Leveraging the new TypeScript/Wasm-based Prisma Client with driver adapters.
- **Tailwind CSS v4**: Styled with the latest version of Tailwind for maximum performance and modern aesthetics.
- **Responsive Design**: Fully responsive UI for mobile, tablet, and desktop.
- **PostgreSQL**: Robust persistence layer for user data.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma 7](https://www.prisma.io/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication**: Custom implementation using Server Actions & `bcryptjs`

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js 20+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/download/) or a hosted database instance (e.g., Supabase, Neon)

## ⚙️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sulaksana23/nextjs-login-register.git
   cd nextjs-login-register
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (or use the existing one) and add your database connection string:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/db_name?schema=public"
   ```

4. **Run Migrations**:
   Sync your database schema:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

6. **Start the Development Server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```text
├── app/                  # Next.js App Router
│   ├── actions/          # Auth server actions
│   ├── dashboard/        # Protected dashboard page
│   ├── login/           # Login page
│   ├── register/        # Registration page
│   └── page.tsx         # Home page
├── lib/                  # Helper utilities (Prisma client)
├── prisma/               # Database schema and migrations
│   ├── schema.prisma    # Prisma schema definition
│   └── generated/        # Generated client (Prisma 7)
└── components/           # Reusable UI components
```

## 🔐 Authentication Flow

1. **Registration**: Validates input, hashes password using `bcryptjs`, and stores user in PostgreSQL.
2. **Login**: Verifies credentials, generates an HTTP-only session cookie.
3. **Session**: Handled via `next/headers` cookies, persisting for 7 days by default.
4. **Protection**: Access to `/dashboard` is restricted based on the presence of a valid session cookie.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by [Sulaksana](https://github.com/sulaksana23)
