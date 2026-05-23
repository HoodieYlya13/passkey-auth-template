# 🔑 Next.js 16 Passkey & Magic Link Authentication Template

An ultra-premium, production-ready, passwordless authentication template built on **Next.js 16**, **React 19**, **Prisma**, **Tailwind CSS v4**, and **WebAuthn (SimpleWebAuthn)**. Designed for modern security standards, lightning-fast performance, and a stunning user experience.

---

## 🏗️ Dual-Architecture Design

This template supports two flexible architectural modes to fit any infrastructure or deployment model, toggled seamlessly via the `NEXT_PUBLIC_SERVERLESS` environment variable.

### ⚡ 1. Serverless Mode (`NEXT_PUBLIC_SERVERLESS=true`) [Default]
* **Monorepo / Self-Contained**: The application runs completely serverless without requiring a separate backend.
* **Direct Database Access**: Direct PostgreSQL querying utilizing the integrated **Prisma ORM**.
* **Direct WebAuthn Verification**: Cryptographic challenge generation and registration/login credential verifications are performed directly within Next.js Server Actions using `@simplewebauthn/server`.
* **Direct Mailing**: Dispatch emails directly from Server Actions using the built-in **Resend** integration.

### 🖥️ 2. Dedicated Backend Client Mode (`NEXT_PUBLIC_SERVERLESS=false`)
* **Lightweight UI Gateway**: The Next.js app acts purely as a highly optimized, localized front-end proxy.
* **API Proxy Boundary**: Next.js Server Actions delegate all core logic, databases transactions, cryptography operations, session token generation, and email dispatches to a dedicated external API server (e.g. built in Java, Go, Spring Boot, etc.).
* **API Delegation Layer**: Utilizes a central, robust `fetchApi` mechanism located in `api/` to seamlessly manage bearer authorization headers, delegate dynamic proxy `set-cookie` headers, and map remote API errors cleanly to localized UI errors.

---

## ✨ Features

- **🔐 Passkey-First Authentication (WebAuthn)**
  - Cryptographically secure, phishing-resistant, and passwordless authentication using `@simplewebauthn/browser` and `@simplewebauthn/server` (in serverless mode).
  - Seamlessly register, rename, and delete multiple passkeys via standard WebAuthn APIs.
- **⚡ Optimistic UI & Premium UX (React 19)**
  - Instant, zero-latency user feedback on all credential mutations (Add, Rename, and Delete passkeys) leveraging React 19's native `useOptimistic` state reducer.
  - Form operations react immediately in the UI and automatically roll back or raise Sonner toast warnings if the background server action encounters an error.
- **✉️ Passwordless Magic Link Fallback**
  - Instant magic link login fallback utilizing **Resend** for bulletproof email delivery.
  - Smart Client-side Email Provider detection: Automatically shows deep-links to Gmail, Yahoo, Outlook, Proton Mail, etc. based on the entered email domain.
  - Development integration with local mail catchers (e.g., Mailpit on port `8025`).
- **⚡ Bleeding Edge Tech Stack**
  - **Next.js 16.2.6** with Turbopack and **Cache Components** (`cacheComponents: true`) enabled.
  - **React 19** incorporating the React Compiler (`reactCompiler: true`), Promise-based Async Request APIs (`cookies()`, `headers()`, `params`), Server Actions (`'use server'`), and optimal client hooks (`useActionState`, `useOptimistic`).
  - **Tailwind CSS v4** featuring responsive animations, adaptive dark/light custom CSS glassmorphism themes (`liquid-glass`), and smooth gradients.
- **🌐 Robust Internationalization (i18n)**
  - Full multi-language support (English `en` & French `fr`) using `next-intl`.
  - Smart automatic browser language detection, Preferred Language Cookie persistence, and smooth localized UI transitions.
- **🛡️ Proxy Network Boundary**
  - Strictly implements Next.js 16's modern `proxy.ts` pattern instead of standard `middleware.ts` for ultra-fast rewrites, redirects, locale processing, and secure session management.
- **📈 Enterprise-Grade Infrastructure**
  - **Prisma ORM** + **PostgreSQL** schema modeling user profiles and WebAuthn credentials, pre-configured for connection pooling (e.g., Vercel Postgres).
  - **Upstash Redis Rate Limiting**: Built-in API and Server Action-level protection to prevent brute force and DDoS attacks.
  - **Theme Engine**: System-adaptive light/dark mode with dynamic `ThemeProvider`.
  - **Sonner Toasts**: High-fidelity theme-adaptive notifications integrated with localized strings.
  - **Developer Shield (Testing Mode)**: Lock down development or staging sites behind a secure `APP_PASSWORD` login using the `auth-testing-mode` route.
  - **🗃️ Secure DB Warming & Inactive User Cleanup (Serverless Mode)**: Nightly secured cron endpoint (`/api/cron`) to keep Upstash Redis and Postgres databases active and warm, while purging unconfirmed signup records created > 24 hours ago.

---

## ⚡ Partial Prerendering (PPR) & Cache Components

This template fully adopts Next.js 16's new **Cache Components** architecture, replacing outdated dynamic rendering behaviors with an explicit, opt-in caching and streaming layout model:

- **Static HTML Shells (`○`)**: Root structures and surrounding page frames (layouts, static headings, styling classes, and loading fallbacks) are statically prerendered at compile time. This allows the template to serve instant, lightweight initial page loads to users.
- **Dynamic Server-Streamed Content (`◐`)**: Dynamic session-dependent blocks (such as user profile details, WebAuthn passkey listings, or active cookie-consent checks) are isolated within React `<Suspense>` boundaries. Next.js server-streams these dynamic components once request-time data (like authentication tokens or database records) is resolved in real-time.
- **Hydration Protection**: The root `<html>` tag uses `suppressHydrationWarning` to gracefully support the streaming client-side dark-theme injection script, which prevents visual theme flickering (FOUC) while keeping React's hydration 100% clean.

---

## 📁 Architecture & Directory Structure

```
├── actions/                   # React 19 Server Actions ('use server')
│   ├── auth/                  # Authentication-related actions
│   │   ├── logout/            # Session destruction & cookie cleanup
│   │   ├── magic-link/        # Magic link dispatching & verification
│   │   ├── passkey/           # WebAuthn register/login credential handshakes (Dual-mode support)
│   │   └── testing-mode/      # Password-gating action for staging shields
│   ├── user/                  # User profile metadata updates
│   ├── base.client.actions.ts # Common client-side action wrappers
│   └── base.server.actions.ts # Rate-limit, auth-checking & error-handling action wrapper
├── api/                       # API integration layer for dedicated backend communication (used when !SERVERLESS)
│   ├── base.api.ts            # Central fetch client with proxy session token forwarding
│   ├── auth.api.ts            # Auth-related external API endpoints definition
│   └── user.api.ts            # User-related external API endpoints definition
├── app/                       # Next.js App Router (Network Boundary)
│   ├── [locale]/              # i18n Root Directory (Locales route segment)
│   │   ├── (main)/            # Layout wrapper for standard profile & homepage
│   │   ├── (no-footer)/       # Login / verification layouts without footer decoration
│   │   └── auth-testing-mode/ # Development staging gate login screen
│   ├── components/            # Atomic Design Page Components & UI elements
│   ├── globals.css            # Tailwind CSS v4 design tokens and customized styles
│   └── layout.tsx             # Global metadata configuration
├── hooks/                     # Reusable React Hooks (Forms, translation helpers, errors)
├── i18n/                      # Internationalization configuration, routing & translations
├── models/                    # TypeScript interfaces & models
├── prisma/                    # Prisma database schemas (PostgreSQL connector)
├── proxy.ts                   # Root proxy for Next.js 16 network-boundary routing
├── schemas/                   # Zod validation schemas for inputs & API calls
└── utils/                     # Shared helper functions (Auth utilities, cookies, errors)
```

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.x or later, Node 20+ recommended)
- **npm**, **yarn**, **pnpm**, or **bun**
- **PostgreSQL** database (only required for Serverless mode)
- **Redis** database (for rate limiting, e.g., Upstash)

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup (Serverless mode only)

Initialize your PostgreSQL database and run migrations to create the tables:

```bash
# Generate the Prisma Client
npx prisma generate

# Create tables in PostgreSQL
npx prisma db push
```

### 4. Setup Environment Variables

Copy the example environment file and fill in your secrets:

```bash
cp .env.example .env
```

Here is a guide to the key variables:

| Environment Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SERVERLESS` | Toggle between Serverless (`true`) and Dedicated Backend (`false`) modes | `true` |
| `NEXT_PUBLIC_APP_NAME` | Display name of the application | `Passkey Auth` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Default language fallback | `en` |
| `NEXT_PUBLIC_TESTING_MODE` | Enable application shield password gating | `true` |
| `APP_PASSWORD` | Access password if `TESTING_MODE` is enabled | `your-secure-dev-password` |
| `ORIGIN` | App Base URL or Dedicated Backend API URL (when `!SERVERLESS`) | `http://localhost:3000` |
| `RP_ID` | Relying Party ID for WebAuthn (domain name) | `localhost` |
| `ISSUER` | JWT Issuer for user session tokens | `passkey-auth-issuer` |
| `JWT_PRIVATE_KEY` | Secret used to sign session JWTs | `generate-a-strong-secret-key` |
| `POSTGRES_PRISMA_URL` | PostgreSQL connection pool URL (Serverless mode) | `postgres://user:pass@host:5432/db?pgbouncer=true` |
| `POSTGRES_URL_NON_POOLING` | Direct PostgreSQL URL for migrations (Serverless mode) | `postgres://user:pass@host:5432/db` |
| `UPSTASH_REDIS_REST_URL` | Redis URL for Upstash Rate Limit | `https://...upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN`| Redis Token for Upstash Rate Limit | `your-upstash-token` |
| `RESEND_API_KEY` | API Key from Resend for Magic Links (Serverless mode) | `re_...` |
| `EMAIL_FROM` | Verified sender address for Magic Links (Serverless mode) | `onboarding@resend.dev` |
| `CRON_SECRET` | Secret token to authorize DB warming and cleanup cron jobs | `any-secure-random-token` |

### 5. Local Email Testing

The magic link testing flow adapts to your active mode:

* **In Serverless Mode (`NEXT_PUBLIC_SERVERLESS=true`)**: During local development (`NODE_ENV !== "production"`), outbound emails (Magic Links, Passkey creation/deletion alerts) are not actually dispatched. Instead, a clean preview and the clickable login link are printed **directly to your terminal console** for instant testing.
* **In Dedicated Backend Mode (`NEXT_PUBLIC_SERVERLESS=false`)**: If `NEXT_PUBLIC_TESTING_MODE` is enabled, the client's "Check your email" link automatically redirects to a local **Mailpit** web console at `http://localhost:8025/` (useful when your external backend is configured to dump mail into Mailpit).

If you want to run Mailpit locally for your dedicated backend:
```bash
# Using Docker
docker run -d -p 8025:8025 -p 1025:1025 axllent/mailpit
```

---

## 🗄️ Database Warming & Daily Cleanup (Serverless Mode)

To prevent free-tier databases (like Neon Postgres or Upstash Redis) from spinning down during periods of inactivity and causing cold starts, a secured daily cron endpoint is integrated at `/api/cron`. In **Serverless Mode**, this route also purges unconfirmed users (users who requested a magic link but never clicked it, meaning they have no `username` and no registered passkeys after 24 hours).

### How it Works:
1. **GitHub Action**: A scheduled GitHub Action runs every 24 hours (configurable in `.github/workflows/database-ping-cleanup.yml`).
2. **API Verification**: The workflow triggers `GET https://your-domain.com/api/cron` passing an `Authorization: Bearer <CRON_SECRET>` header.
3. **Execution**:
   - Pings Upstash Redis to keep it warmed.
   - Pings Neon PostgreSQL (in Serverless mode).
   - Deletes inactive signups created > 24 hours ago.

### Configuration (Staging/Production Setup):
1. **Hosting Environment (e.g. Vercel)**:
   Add `CRON_SECRET` to your environment variables with a strong, random key.
2. **GitHub Actions Secrets**:
   Go to your GitHub repository **Settings** -> **Secrets and variables** -> **Actions** and add two Secrets:
   - `APP_DOMAIN`: Your live app domain (e.g., `your-app.vercel.app` or `your-domain.com`).
   - `CRON_SECRET`: The exact same secret token configured in your hosting environment.

---

## 🛠️ Development & Production Scripts

In the project directory, you can run:

```bash
# Run local dev server with Turbopack caching
npm run dev

# Compile the application for production
npm run build

# Start a production server
npm run start

# Lint files with ESLint (React Compiler aware rules)
npm run lint
```

---

## 🔒 Next.js 16 & React 19 Best Practices Adhered To

This template conforms perfectly to the most rigorous React 19 and Next.js 16 standards:
1. **No standard `middleware.ts`**: Clean, lightweight network control is achieved inside `proxy.ts`. Complex logic, DB calls, and heavy processing have been decoupled from the proxy layer.
2. **Awaited Async Request APIs**: In alignment with Next.js 16, promises like `cookies()` and dynamic `params` are strictly awaited before use.
3. **React Compiler Optimization**: No boilerplate `useMemo`, `useCallback`, or `React.memo` calls. Code is kept clean, readable, and natively optimized by the React Compiler.
4. **Form Handling via Actions**: Traditional `useEffect` fetching has been banned. Form submissions use React 19's native action state workflows.
5. **Partial Prerendering (PPR) by Design**: Dynamic cookie-based operations and Server Action handshakes are cleanly encapsulated within component boundaries inside layouts and page components using React 19 `<Suspense>`, allowing Next.js to prerender static pages instantly and stream dynamic components down when requested.

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE). Feel free to customize and use it for your SaaS platforms, portfolios, or enterprise apps!
