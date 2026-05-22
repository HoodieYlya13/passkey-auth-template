# 🔑 Next.js 16 Passkey & Magic Link Authentication Template

An ultra-premium, production-ready, passwordless authentication template built on **Next.js 16**, **React 19**, **Prisma**, **Tailwind CSS v4**, and **WebAuthn (SimpleWebAuthn)**. Designed for modern security standards, lightning-fast performance, and a stunning user experience.

---

## ✨ Features

- **🔐 Passkey-First Authentication (WebAuthn)**
  - Cryptographically secure, phishing-resistant, and passwordless authentication using `@simplewebauthn/browser` and `@simplewebauthn/server`.
  - Seamlessly register, rename, and delete multiple passkeys via standard WebAuthn APIs.
- **✉️ Passwordless Magic Link Fallback**
  - Instant magic link login fallback utilizing **Resend** for bulletproof email delivery.
  - Smart Client-side Email Provider detection: Automatically shows deep-links to Gmail, Yahoo, Outlook, Proton Mail, etc. based on the entered email domain.
  - Development integration with local mail catchers (e.g., Mailpit on port `8025`).
- **⚡ Bleeding Edge Tech Stack**
  - **Next.js 16** with experimental Turbopack caching.
  - **React 19** incorporating the React Compiler (`reactCompiler: true`), Promise-based Async Request APIs (`cookies()`, `headers()`, `params`), Server Actions (`'use server'`), and optimal client hooks (`useActionState`, `useOptimistic`).
  - **Tailwind CSS v4** featuring responsive animations, modern custom CSS glassmorphism themes (`liquid-glass`), and sleek gradients.
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

---

## 📁 Architecture & Directory Structure

```
├── actions/                   # React 19 Server Actions ('use server')
│   ├── auth/                  # Authentication-related actions
│   │   ├── logout/            # Session destruction & cookie cleanup
│   │   ├── magic-link/        # Magic link dispatching & verification
│   │   ├── passkey/           # WebAuthn register/login credential handshakes
│   │   └── testing-mode/      # Password-gating action for staging shields
│   ├── user/                  # User profile metadata updates
│   ├── base.client.actions.ts # Common client-side action wrappers
│   └── base.server.actions.ts # Rate-limit, auth-checking & error-handling action wrapper
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
- **PostgreSQL** database (local, Docker, or managed like Neon/Vercel)
- **Redis** database (for rate limiting, e.g., Upstash)

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup (Prisma)

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
| `NEXT_PUBLIC_APP_NAME` | Display name of the application | `Passkey Auth` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Default language fallback | `en` |
| `NEXT_PUBLIC_TESTING_MODE` | Enable application shield password gating | `true` |
| `APP_PASSWORD` | Access password if `TESTING_MODE` is enabled | `your-secure-dev-password` |
| `ORIGIN` | WebApp base URL (critical for WebAuthn RP verification) | `http://localhost:3000` |
| `RP_ID` | Relying Party ID for WebAuthn (domain name) | `localhost` |
| `ISSUER` | JWT Issuer for user session tokens | `passkey-auth-issuer` |
| `JWT_PRIVATE_KEY` | Secret used to sign session JWTs | `generate-a-strong-secret-key` |
| `POSTGRES_PRISMA_URL` | PostgreSQL connection pool URL | `postgres://user:pass@host:5432/db?pgbouncer=true` |
| `POSTGRES_URL_NON_POOLING` | Direct PostgreSQL URL for migrations | `postgres://user:pass@host:5432/db` |
| `UPSTASH_REDIS_REST_URL` | Redis URL for Upstash Rate Limit | `https://...upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN`| Redis Token for Upstash Rate Limit | `your-upstash-token` |
| `RESEND_API_KEY` | API Key from Resend for Magic Links | `re_...` |
| `EMAIL_FROM` | Verified sender address for Magic Links | `onboarding@resend.dev` |

### 5. Running local mail catcher (Optional)
If you want to test Magic Links locally without configuring an external SMTP/Resend API, you can run a local email interceptor like **Mailpit**:

```bash
# Using Docker
docker run -d -p 8025:8025 -p 1025:1025 axllent/mailpit
```
When running Next.js locally, the application automatically redirects the "Check your email" link to `http://localhost:8025/` in development mode for seamless local testing.

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

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE). Feel free to customize and use it for your SaaS platforms, portfolios, or enterprise apps!
