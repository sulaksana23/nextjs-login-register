# Next.js 16 Authentication with Prisma 7 & Tailwind CSS v4

A modern authentication system built with Next.js 16, Auth.js v5, Prisma 7, PostgreSQL, and Tailwind CSS v4. The app includes email/password login, registration, protected routes, and optional Google/GitHub OAuth providers.

![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Prisma 7](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql)

![Project Preview](docs/images/app-preview.svg)

## 🚀 Features

- **Authentication**: Register and log in with email/password.
- **Auth.js v5**: Session handling and route protection powered by Auth.js.
- **OAuth Ready**: Optional Google and GitHub sign-in providers.
- **Prisma 7**: PostgreSQL integration with Prisma ORM.
- **Tailwind CSS v4**: Modern UI styling.
- **Responsive Design**: Works across mobile and desktop layouts.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Authentication**: [Auth.js / NextAuth v5](https://authjs.dev/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma 7](https://www.prisma.io/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Password Hashing**: `bcryptjs`

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
   Copy `.env.example` to `.env` and add the required values:

   ```bash
   cp .env.example .env
   ```

   Then update the values:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/db_name?schema=public"
   AUTH_SECRET="generate-a-random-secret"
   ```

   Optional OAuth providers:
   ```env
   AUTH_GOOGLE_ID=""
   AUTH_GOOGLE_SECRET=""
   AUTH_GITHUB_ID=""
   AUTH_GITHUB_SECRET=""
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

## 🖼️ Screenshots

The repository includes a visual preview of the main flows:

- Login page
- Register page
- Protected dashboard page

See the preview image above in the repository header section.

## 🔐 Authentication Flow

1. **Registration**: Validates input, hashes password with `bcryptjs`, and stores the user in PostgreSQL.
2. **Login**: Auth.js verifies credentials and creates the session.
3. **Session**: JWT session strategy is used in this project.
4. **Protection**: `proxy.ts` redirects unauthenticated users away from protected routes such as `/dashboard`.

## 🔑 Environment Variables

Required:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/db_name?schema=public"
AUTH_SECRET="your-random-secret"
```

Optional:

```env
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
```

Notes:

- Use `AUTH_SECRET`, not `NEXTAUTH_SECRET`.
- Generate a secret with:

```bash
openssl rand -base64 32
```

- If you change `AUTH_SECRET`, existing login sessions may become invalid.

## ▲ Deploying to Vercel

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. In `Project Settings > Environment Variables`, add at least:

```env
DATABASE_URL=...
AUTH_SECRET=...
```

4. Set the variables for `All Environments` unless you only want them for a specific environment.
5. If you use OAuth, also add:

```env
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
```

6. Redeploy the project after saving environment variables.

Important:

- In this project, the correct secret key is `AUTH_SECRET`.
- Do not put the secret value in the `Key` field on Vercel. The `Key` must stay `AUTH_SECRET`, and the secret goes in `Value`.
- The build script already runs:
- The production build script runs:

```bash
prisma generate && next build --webpack
```

- Run database migrations separately when needed:

```bash
npm run db:migrate:deploy
```

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by [Sulaksana](https://github.com/sulaksana23)
