# 🎬 Mobile Movie App

A powerful and beautiful mobile application for browsing, searching, and saving movies, built with **React Native**, **Expo**, and **Appwrite**.

## ✨ Features

- **🌙 Premium Dark & Minimalist UI**: A sleek edge-to-edge dark theme with pure blacks, muted text, and smooth rounded corners.
- **✨ Fluid Animations**: Physics-based slide-up forms and transitions powered by `react-native-reanimated`.
- **🔥 Trending Movies**: View the latest popular movies with real-time updates.
- **🔍 Smart Search**: Instantly search for movies with dynamic results and categorized UI.
- **📱 Responsive Design**: Optimized for both iOS and Android devices with native-feeling Tab Navigation.
- **💾 Backend Integration**: Powered by Appwrite for robust user authentication and data handling.
- **📂 Categorized Saves (Context API)**: Save movies locally in custom folders/categories (Want to Watch, Already Watched).
- **📊 User Profile Stats**: Track watch time and total movies watched dynamically.

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) & [React Native](https://reactnative.dev/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (TailwindCSS)
- **Backend Service**: [Appwrite](https://appwrite.io/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
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

    Then, open `.env` and fill in your Appwrite and TMDB credentials (refer to `.env.example` for the required keys).

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
