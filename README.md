# 🎬 Mobile Movie App

A powerful and beautiful mobile application for browsing and searching movies, built with **React Native**, **Expo**, and **Appwrite**.

![Project Banner](https://via.placeholder.com/1200x600?text=Mobile+Movie+App+Banner)

## ✨ Features

- **🔥 Trending Movies**: View the latest popular movies with real-time updates.
- **🔍 Smart Search**: Instantly search for movies with a responsive search bar.
- **📱 Responsive Design**: Optimized for both iOS and Android devices.
- **🎨 Modern UI/UX**: Built with NativeWind (TailwindCSS) for a sleek and consistent look.
- **💾 Backend Integration**: Powered by Appwrite for robust data handling.

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) & [React Native](https://reactnative.dev/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (TailwindCSS)
- **Backend Service**: [Appwrite](https://appwrite.io/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Fonts**: Google Fonts

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- [Expo Go](https://expo.dev/client) app installed on your physical device, or an Android/iOS emulator.

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/YOUR_USERNAME/mobile_movie_app.git
    cd mobile_movie_app
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and add your Appwrite credentials:

    ```env
    EXPO_PUBLIC_APPWRITE_ENDPOINT=your_endpoint
    EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
    EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
    EXPO_PUBLIC_APPWRITE_COLLECTION_ID=your_collection_id
    EXPO_PUBLIC_MOVIE_API_KEY=your_tmdb_api_key
    ```

4.  **Run the app**
    ```bash
    npm start
    ```

## 📂 Project Structure

```bash
mobile_movie_app/
├── app/                  # Application screens and routing
├── components/           # Reusable UI components
├── constants/            # Global constants (icons, images, theme)
├── services/             # API services (Appwrite, TMDB)
├── assets/               # Static assets (fonts, images)
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
