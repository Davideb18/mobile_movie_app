# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-03-04

### Added

- 🖼️ Migrated image rendering to `expo-image` for automatic memory and disk caching across the app.
- ⚡ Added `prefetch={true}` to `MovieCard` and `TrendingCard` links for instant route transitions.
- 💾 Implemented module-level search cache (`globalSearchCache`) in `search.tsx` to preserve results across tab switches.
- 📊 Profile page now displays per-month watch time in a horizontally scrollable card with swipe hint.
- 🎭 Top Genres section on Profile now links to filtered search results when tapped.

### Changed

- 🔇 Removed all debug `console.log` statements across the codebase.
- ✏️ Rewrote all code comments to be concise, English, and consistent throughout the project.
- 🧹 Removed leftover commented-out JSX and dead code fragments.
- 🔠 Normalized error message strings in `api.ts`.

## [1.2.0] - 2026-02-27

### Added

- 🏷️ Full support for Custom Categories in Saved Movies.
- 🗑️ Secure category deletion with confirmation prompts to protect user data.
- 📱 Smooth animated bottom-sheet UI for creating new categories on-the-fly.
- ♻️ Optimized category list rendering with ScrollView to prevent UI overflow on large collections.
- ☁️ Connected `SavedMoviesContext` to Appwrite Database to persist saved collections.
- 🎨 Visual fallback and polished centering for empty lists in the Saved Tab.
- 🐛 Fixed active session error in Auth flow with automatic redirection to Home.
- 🌑 Complete overhaul to "Premium Dark Minimalist" UI theme.
- ✨ Fluid slide-up entrance animations using `react-native-reanimated`.
- 📁 Added `SavedMoviesContext` for localized movie saving logic with custom categories.
- 🎬 Rebuilt `movies/[id].tsx` Details screen as a sliding bottom sheet modal.

## [1.1.0] - 2026-02-21

### Added

- 🔐 Sign-in screen with email/password authentication via Appwrite.
- 📝 Sign-up screen with username, email, and password fields.
- 👤 `GlobalProvider` context to manage auth state (`user`, `isLogged`, `loading`) app-wide.
- 🔄 Automatic session restore on app launch — redirects logged-in users to Home without re-entering credentials.
- �️ Avatar auto-generated from user initials via Appwrite Avatars API as fallback when no profile image is set.
- 🔒 Protected routes — unauthenticated users are redirected to Sign-in.
- 🚪 Logout functionality that clears session and resets auth state.

## [1.0.0] - 2026-02-08

### Added

- 🎬 Movie browsing functionality with trending movies.
- 🔍 Search feature to find movies by title.
- 📄 Detailed movie information view.
- 🎨 Modern UI with NativeWind styling.
- 🌐 Appwrite backend integration for data management.
- 🔧 Environment configuration documentation (`.env.example`).
