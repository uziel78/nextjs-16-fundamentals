A full-stack blog application built with **Next.js 16**, **Convex**, and **Better Auth**. It features real-time posts and comments, full-text search, user authentication, dark/light theme support, and live presence indicators.

**Live Demo:** [nextjs-16-fundamentals.vercel.app](https://nextjs-16-fundamentals.vercel.app)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/) package manager

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd nextjs-16-fundamentals

# Install dependencies
pnpm install
```

### Running Locally

You need **two terminals** running simultaneously:

**Terminal 1 — Next.js dev server:**

```bash
pnpm dev
```

**Terminal 2 — Convex backend:**

```bash
pnpm dlx convex dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
pnpm build
pnpm start
```

---

## Tech Stack

- **Next.js 16** — React framework providing App Router, server components, server actions, file-based routing, and image optimisation.
- **React 19** — UI library powering the component tree with the latest concurrent features.
- **Convex** — Real-time backend-as-a-service used for the database, serverless functions, full-text search, and file storage.
- **Better Auth** — Authentication library handling sign-up, login, and session management, integrated with Convex via the `@convex-dev/better-auth` adapter.
- **Tailwind CSS 4** — Utility-first CSS framework for styling the entire UI.
- **shadcn/ui** — Pre-built, accessible UI components (buttons, cards, inputs, dropdowns, etc.) built on Radix UI primitives.
- **Radix UI** — Headless, accessible primitives underlying the shadcn/ui components.
- **React Hook Form + Zod** — Form state management paired with schema validation for type-safe form handling on create and auth pages.
- **Lucide React** — Icon library providing consistent SVG icons throughout the app.
- **next-themes** — Theme switching utility enabling system, light, and dark mode support.
- **Sonner** — Lightweight toast notification library for user feedback.
- **TypeScript** — Static typing across the entire codebase for safety and developer experience.

---

## Useful Links

| Technology      | Homepage                                     |
| --------------- | -------------------------------------------- |
| Next.js         | <https://nextjs.org>                         |
| React           | <https://react.dev>                          |
| Convex          | <https://www.convex.dev>                     |
| Better Auth     | <https://www.better-auth.com>                |
| Tailwind CSS    | <https://tailwindcss.com>                    |
| shadcn/ui       | <https://ui.shadcn.com>                      |
| Radix UI        | <https://www.radix-ui.com>                   |
| React Hook Form | <https://react-hook-form.com>                |
| Zod             | <https://zod.dev>                            |
| Lucide Icons    | <https://lucide.dev>                         |
| next-themes     | <https://github.com/pacocoursey/next-themes> |
| Sonner          | <https://sonner.emilkowal.dev>               |
| pnpm            | <https://pnpm.io>                            |

<!-- https://dashboard.convex.dev/t/rune-husa78/nextjs-16-fundamentals/acoustic-mastiff-678 -->

<!-- https://nextjs-16-fundamentals.vercel.app/ -->
