# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- 🏷️ Added full support for Custom Categories in Saved Movies.
- 🗑️ Implemented secure category deletion with confirmation prompts to protect user data.
- 📱 Built a smooth, animated bottom-sheet UI for creating new categories on-the-fly.
- ♻️ Optimized category list rendering with ScrollView to prevent UI overflow on large collections.
- ☁️ Connected `SavedMoviesContext` to Appwrite Database to persist user's saved collections dynamically.
- 🎨 Added visual fallback and polished centering for empty lists in the Saved Tab.
- 🐛 Fixed active session error in Auth flow and added automatic redirection to Home.
- 🌑 Complete overhaul to "Premium Dark Minimalist" UI Theme.
- ✨ Implemented fluid slide-up entrance animations using `react-native-reanimated`.
- 📁 Added `SavedMoviesContext` to handle localized movie saving logic with custom categories.
- 📱 Refactored internal screens (Home, Search, Saved, Profile) with pure black backgrounds and cohesive design.
- 🎬 Rebuilt `movies/[id].tsx` Details screen as a sliding bottom sheet modal.

## [1.2.0] - 2026-03-04

### Added

- 🖼️ Migrated image rendering to `expo-image` for automatic memory and disk caching across the app.
- ⚡ Added `prefetch={true}` to `MovieCard` and `TrendingCard` links for instant route transitions.
- 💾 Implemented module-level search cache (`globalSearchCache`) in `search.tsx` to preserve results between tab switches.
- 📊 Profile page now displays per-month watch time in a horizontally scrollable card with swipe hint.
- 🎭 Top Genres section on Profile now links to filtered search results when tapped.

### Changed

- 🔇 Removed all debug `console.log` statements across the codebase (`appwrite.ts`, `GlobalProvider.tsx`, `SavedMoviesContext.tsx`, `sign-up.tsx`).
- ✏️ Rewrote all code comments to be concise, English, and consistent throughout the project.
- 🧹 Removed leftover commented-out JSX and dead code fragments.
- 🔠 Normalized error message strings (removed all-caps formatting from `api.ts`).
- 🗑️ Dropped stale header comments from `useFetch.ts`.

## [1.1.0] - 2024-02-21

### Added

- 🔐 Login and Sign-up screens structure.
- 👤 User authentication context.

## [1.0.0] - 2024-02-08

### Added

- 🎬 Movie browsing functionality with trending movies.
- 🔍 Search feature to find movies by title.
- 📄 Detailed movie information view.
- 🎨 Modern UI with NativeWind styling.
- 🌐 Appwrite backend integration for data management.
- 🔧 Environment configuration documentation (`.env.example`).
