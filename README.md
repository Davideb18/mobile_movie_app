# 🎬 Mobile Movie App

A powerful and beautiful mobile application for browsing, searching, and saving movies, built with **React Native**, **Expo**, **Appwrite**, and **Google Gemini AI**.

## ✨ Features

- **🌙 Premium Dark & Minimalist UI**: A sleek edge-to-edge dark theme with pure blacks, muted text, and smooth rounded corners.
- **✨ Fluid Animations**: Physics-based slide-up forms and transitions powered by `react-native-reanimated`.
- **🔥 Trending Movies**: View the latest popular movies with real-time updates.
- **🔍 Smart Search**: Instantly search for movies by title or genre, with results cached between tab switches.
- **🤖 AI Vibe Search**: Describe a scene, mood, or vibe in natural language (Italian or English), and Google Gemini recommends the perfect match — complete with a tailored explanation and 9 alternative picks.
- **📱 Responsive Design**: Optimized for both iOS and Android devices with native-feeling Tab Navigation.
- **📂 Dynamic Custom Categories**: Create, manage, and delete custom collections to save movies exactly how you want.
- **💾 Cloud Synchronization**: Powered by Appwrite for robust real-time data handling and persistence of your collections.
- **📊 User Profile & Stats**: Track total and monthly watch time, and browse your top genres with direct search links.
- **⚡ Aggressive Caching**: Images are cached via `expo-image`, routes are prefetched on render, and search state persists across tab navigation.

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) & [React Native](https://reactnative.dev/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (TailwindCSS)
- **Backend Service**: [Appwrite](https://appwrite.io/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **AI**: [Google Gemini API](https://aistudio.google.com/)
- **Movie Data**: [TMDB API](https://developer.themoviedb.org/)
- **State Management**: React Context API
- **Animations**: React Native Reanimated

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- [Expo Go](https://expo.dev/client) app installed on your physical device, or an Android/iOS emulator.

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/Davideb18/mobile_movie_app.git
    cd mobile_movie_app
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Configuration**

    Copy the example environment file to create your local declaration:

    ```bash
    cp .env.example .env
    ```

    Then, open `.env` and fill in your credentials:
    - `EXPO_PUBLIC_MOVIE_API_KEY` — from [TMDB](https://developer.themoviedb.org/)
    - `EXPO_PUBLIC_GEMINI_API_KEY` — from [Google AI Studio](https://aistudio.google.com/) (free tier available)
    - Appwrite credentials (refer to `.env.example` for all required keys)

4.  **Run the app**
    ```bash
    npx expo start
    ```

## 📂 Project Structure

```bash
mobile_movie_app/
├── app/                  # Application screens and routing (Expo Router)
├── components/           # Reusable UI components (GlassView, FormField, etc.)
├── constants/            # Global constants (icons, images, theme)
├── context/              # React Context for state management (Global, SavedMovies)
├── services/             # API services (Appwrite, TMDB)
├── assets/               # Static assets (fonts, images)
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
