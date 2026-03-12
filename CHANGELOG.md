# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-03-12

### Added

- ⭐ **Movie Star Rating** — users can rate any saved movie 1–5 stars directly in the Saved tab or from the Movie Detail page. Ratings are persisted in Appwrite and synced across all lists via Optimistic UI (local state updates immediately, Appwrite write happens asynchronously).
- 🕑 **AI & Keyword Search History** — last 5 searches for each mode are persisted to AsyncStorage. A toggle button reveals a history panel with chips (AI) and list items (keyword). Individual histories can be cleared independently.
- 📤 **Native Share Button** — a share icon on every Movie Detail page uses the React Native `Share` API to let users share a movie title + TMDB link via any installed app.
- 💀 **Skeleton Loading for AI Search** — while Gemini is processing, a grid of 9 animated placeholder cards provides a rich loading state instead of a bare spinner.
- 🧹 **Clear AI Results button** — a one-tap button dismisses the AI result set, resets the search bar, and reloads the default movie feed.

### Changed

- ⚡ **Parallelized AI fetch pipeline** — `topMovie` and all 9 `otherMovies` TMDB lookups are now dispatched in a single `Promise.all`, reducing AI search wall-clock time by ~70% compared to the previous sequential approach.
- 🗃️ **Typed `Movie` interface** — replaced all `any` types for movie objects across `MovieCard.tsx`, `search.tsx`, `home.tsx`, and `appwrite.ts` with a shared `Movie` interface in `interfaces/`.
- 💬 **Improved error logging** — `fetchMovieByTitle` now logs the specific failing title, making AI pipeline debugging significantly faster.
- 🔑 **Search cache cleared on logout** — `globalSearchCache` is now reset when the user logs out, preventing stale data leaking across sessions on shared devices.
- 📝 **Portfolio-ready API comments** — `services/ai.ts` and `services/api.ts` now include explicit `NOTE:` comments explaining the client-side key exposure trade-off for a CV/portfolio context.
- `returnKeyType="search"` added to AI search input so the keyboard shows a Search button.
- N/A formatting for `budget` and `revenue` on the Movie Detail page.
- Removed unused `onClear` prop from `SearchBar` interface.

### Fixed

- 🗑️ Deleted `test_animation.ts` scratch file left in `components/`.
- 🔤 Resolved TypeScript case-sensitivity conflict between `StarRating.tsx` and `Starrating.tsx` by renaming the component to `MovieRating.tsx`.

## [1.4.0] - 2026-03-05

### Added

- 🤖 **AI Vibe Search** — new AI-powered search bar that accepts natural language descriptions (in Italian or English) and uses the Google Gemini API to recommend the best matching movies.
- 🌍 **Multilingual AI support** — the Gemini prompt now explicitly handles Italian queries, translating intent into TMDB-compatible English movie titles automatically.
- 🎨 **Structured AI results UI** — AI search results show a large hero card for the top pick (with a Gemini-generated explanation of why it matches the vibe), plus a horizontal scroll list of 9 alternative suggestions.
- 🖱️ **Clickable AI top pick card** — tapping the hero card navigates to the full movie detail page, consistent with `MovieCard` behaviour.
- ✕ **Clear button in search bars** — a dismiss button appears inside any `SearchBar` when text is present, allowing one-tap clearing.
- 📏 **Multiline AI search bar** — the AI search input expands vertically to accommodate long vibe descriptions without hiding text.
- 🔁 **AnimatedAIBorder** — rotating Google-colors gradient border animation wrapping the AI search bar, indicating it's AI-powered.

### Changed

- ⚡ `fetchMovieByTitle` now returns the top TMDB match for a given title, used by the AI pipeline.
- 📐 `MovieCard` accepts an optional `className` prop to override its default width, enabling correct rendering inside horizontal scroll lists.
- 🗑️ Removed dead `onClear` prop from `SearchBar` component interface — clear functionality is handled directly via `onChangeText`.

### Fixed

- 💰 Budget and Revenue on movie detail page now display `N/A` when TMDB returns zero or missing values, instead of showing `$0M` or `$0.05M`.
- 🎬 Horizontal "Also Consider" movie cards no longer appear squished — they now use a fixed width wrapper with `w-full` inside.

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
