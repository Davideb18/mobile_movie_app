# 🎬 Movie Discovery App

A cross-platform mobile app for browsing, discovering, and saving movies — featuring **Google Gemini AI-powered search**, real-time **Appwrite** backend, and a polished premium dark UI.

---

## ✨ Features

| Category | Feature |
|---|---|
| 🔍 Search | Keyword search with smart genre routing (20+ genres → TMDB `/discover`) |
| 🤖 AI Search | Natural language vibe search via Gemini 2.5 Flash (IT/EN), with a hero result card + 9 alternatives |
| 💾 Collections | Create, manage, and delete custom watchlists backed by Appwrite |
| ⭐ Ratings | 1–5 star rating per saved movie, persisted to Appwrite with Optimistic UI |
| 📤 Share | Share any movie via native Share API |
| 📊 Profile Stats | Total & monthly watch time (horizontal swipeable cards), top genres with search shortcuts |
| 🕑 Search History | Last 5 AI and keyword queries persisted in AsyncStorage with LRU eviction |
| ⚡ Performance | Parallel API calls (`Promise.all`), 500ms debounce, session-scoped search cache, 3-page home pre-fetch (60 movies) |
| 📳 Haptics | Native haptic feedback (`expo-haptics`) on save, AI submit, tab press, and remove |
| 🔐 Auth | Email/password auth via Appwrite with session restore on launch |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev/) + [React Native](https://reactnative.dev/) |
| Language | TypeScript |
| Styling | [NativeWind](https://www.nativewind.dev/) (TailwindCSS for RN) |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based) |
| Backend | [Appwrite](https://appwrite.io/) (Auth, Database, Avatars) |
| AI | [Google Gemini 2.5 Flash](https://aistudio.google.com/) |
| Movie Data | [TMDB API v3](https://developer.themoviedb.org/) |
| State | React Context API |
| Local Storage | AsyncStorage |
| Animations | React Native Reanimated |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go](https://expo.dev/client) on your phone, or an iOS/Android emulator

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/Davideb18/mobile_movie_app.git
    cd mobile_movie_app
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Environment Configuration**

    ```bash
    cp .env.example .env
    ```

    Fill in your `.env`:

    | Variable | Where to get it |
    |---|---|
    | `EXPO_PUBLIC_MOVIE_API_KEY` | [TMDB Developer Portal](https://developer.themoviedb.org/) |
    | `EXPO_PUBLIC_GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/) (free tier) |
    | `EXPO_PUBLIC_APPWRITE_*` | Your [Appwrite](https://appwrite.io/) project settings |

4. **Run the app**

    ```bash
    npx expo start
    ```

    Scan the QR code with Expo Go, or press `i`/`a` for iOS/Android simulator.

---

## 📂 Project Structure

```
mobile_movie_app/
├── app/
│   ├── (auth)/           # Sign-in and Sign-up screens
│   ├── (tabs)/           # Tab screens: Home, Search, Saved, Profile
│   └── movies/[id].tsx   # Movie detail bottom-sheet modal
├── components/           # Reusable UI: MovieCard, SearchBar, MovieRating, etc.
├── constants/            # Icons, images, theme tokens
├── context/              # GlobalProvider (auth), SavedMoviesContext (collections)
├── interfaces/           # Shared TypeScript types (Movie, MovieDetails)
├── services/             # API layers: appwrite.ts, api.ts, ai.ts, storage.ts
└── assets/               # Fonts, images
```

---

## ⚠️ Security Note

For this portfolio project, API keys are accessed directly on the client via `EXPO_PUBLIC_*` env variables (which get embedded in the JS bundle). In a production app, these would be proxied through a secure backend. Comments in `services/ai.ts` and `services/api.ts` document this trade-off explicitly.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
