# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run check        # TypeScript type checking
npm run check:watch  # Type checking with watch mode  
npm run lint         # ESLint + Prettier check
npm run format       # Format code with Prettier

# Database Setup
# Run supabase/schema.sql in Supabase SQL editor
node setup-schema.js    # Database setup script
node verify-schema.js   # Verify schema setup
```

## Architecture Overview

This is a SvelteKit application for group-based praise/encouragement messaging, using Supabase as the backend service.

### Core Technology Stack
- **SvelteKit 2.0** with TypeScript for full-stack framework
- **Supabase** for authentication, database (PostgreSQL), and real-time features
- **Tailwind CSS** for styling
- **Vercel** deployment with Node.js 20.x runtime

### Authentication & Session Management
Authentication flows through Google OAuth via Supabase Auth:
- `src/hooks.server.ts` handles server-side session management
- Cookie-based sessions with secure configuration
- `src/lib/stores/auth.ts` manages client-side auth state
- Protected routes require authentication validation

### Database Architecture
PostgreSQL schema with Row Level Security (RLS) policies:

**Core Tables:**
- `users` - User profiles linked to Supabase Auth
- `groups` - Communities with configurable praise cooldown settings
- `group_members` - Role-based membership (admin/member)
- `praise_messages` - Core feature with emoji, message, privacy options
- `praise_cooldowns` - Anti-spam tracking with configurable intervals

**Key Business Logic:**
- Praise cooldown system (configurable from seconds to years)
- Self-praise prevention via database constraints
- Group capacity limits (1-1000 members)
- Anonymous and public/private praise options

### Data Access Pattern
Three-layer architecture:

1. **Utility Layer** (`src/lib/utils/`):
   - `groups.ts` - Group CRUD operations and membership
   - `praise.ts` - Praise system with cooldown validation
   - `members.ts` - Member management functions
   - `auth.ts` - Authentication utilities

2. **Type Layer** (`src/lib/database.types.ts`):
   - Auto-generated TypeScript types from Supabase schema
   - Helper types: `Tables<T>`, `Inserts<T>`, `Updates<T>`

3. **Client Layer** (`src/lib/supabase.ts`):
   - Configured Supabase client with typed database interface

### Component Architecture
Feature-based component organization:
```
src/lib/components/
├── dashboard/     # Group grid and cards
├── create-group/  # Multi-step group creation
├── group/        # Praise system UI
├── invite/       # Invitation flow
├── settings/     # Admin group management
└── [common components]
```

Components follow Svelte's reactive patterns with TypeScript prop interfaces.

### Route Structure & Data Loading
File-based routing with server-side data loading:
- `+page.server.ts` files handle authenticated data fetching
- Real-time updates via Supabase subscriptions in components
- Error handling through `+error.svelte` boundaries

**Key Routes:**
- `/dashboard` - User's groups with member counts and praise stats
- `/group/[id]` - Group detail with real-time praise feed
- `/group/[id]/settings` - Admin-only group configuration
- `/invite/[code]` - Public invitation links with group preview

### State Management Strategy
**Server State:** Managed by Supabase with real-time subscriptions
**Client State:** Svelte stores for UI-specific state:
- `auth.ts` - Authentication state
- `toast.ts` - Notification system

### Real-time Features
Supabase real-time subscriptions for:
- Live praise message updates
- Member join/leave notifications
- Group setting changes

### Security Model
- RLS policies ensure users only access their group data
- Role-based permissions (admin vs member)
- Server-side validation with client-side optimistic updates
- Database constraints prevent business rule violations

### Environment Configuration
Required environment variables:
- `PUBLIC_SUPABASE_URL` - Supabase project URL
- `PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### Korean Localization
The application is designed for Korean users:
- Korean language UI text
- Korean error messages and validation
- Cultural considerations in praise/encouragement system