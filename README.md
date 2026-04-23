# Twitter Clone

Mobile app clone of X/Twitter built with Expo Router, Clerk authentication, and Convex backend support.

## Project structure

- `app/_layout.tsx` � root providers and safe area wrapper
- `app/index.tsx` � initial redirect to auth
- `app/(auth)/login.tsx` � Google OAuth login screen
- `app/(auth)/loader.tsx` � auth loading screen
- `app/(tabs)/_layout.tsx` � tab navigator with 4 tabs
- `app/(tabs)/index.tsx` � Feed placeholder
- `app/(tabs)/create.tsx` � Create placeholder
- `app/(tabs)/notifications.tsx` � Notifications placeholder
- `app/(tabs)/profile.tsx` � Profile placeholder
- `components/InitialLayout.tsx` � auth-based route protection
- `providers/ClerkAndConvexProvider.tsx` � Clerk + Convex provider setup
- `constants/theme.ts` � dark theme colors
- `styles/login.styles.ts` � login screen styles
- `convex/auth.config.ts` � Convex auth config helper

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` with Clerk and Convex settings:
   ```bash
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   EXPO_PUBLIC_CONVEX_URL=https://your-convex-project-url.convex.cloud
   EXPO_PUBLIC_CLERK_ISSUER=https://your-clerk-domain.clerk.com
   ```
3. Start the app:
   ```bash
   npm start
   ```

## Notes

- Auth is protected by `components/InitialLayout.tsx` and redirects unauthorized users to `/(auth)/login`.
- Convex is configured through `providers/ClerkAndConvexProvider.tsx` and uses the `useConvexAuth` hook.
- Tab navigation is implemented in `app/(tabs)/_layout.tsx` with `MaterialIcons` icons.
