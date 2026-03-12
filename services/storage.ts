import AsyncStorage from "@react-native-async-storage/async-storage";

const SEARCH_HISTORY_KEY = "@search_history";
const AI_SEARCH_HISTORY_KEY = "@ai_search_history";
const MAX_HISTORY_LENGTH = 5;

// --- NORMAL SEARCH HISTORY ---
export const getSearchHistory = async (): Promise<string[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to fetch search history", e);
    return [];
  }
};

export const saveSearchQuery = async (query: string) => {
  if (!query.trim()) return;

  try {
    const history = await getSearchHistory();
    // remove duplicate if exists to push it to the top
    const filteredHistory = history.filter(
      (item) => item.toLowerCase() !== query.toLowerCase(),
    );

    // add to top and slice
    const newHistory = [query, ...filteredHistory].slice(0, MAX_HISTORY_LENGTH);
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  } catch (e) {
    console.error("Failed to save search query", e);
  }
};

export const clearSearchHistory = async () => {
  try {
    await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (e) {
    console.error("Failed to clear search history", e);
  }
};

// --- AI SEARCH HISTORY ---
export const getAiSearchHistory = async (): Promise<string[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(AI_SEARCH_HISTORY_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to fetch AI search history", e);
    return [];
  }
};

export const saveAiSearchQuery = async (query: string) => {
  if (!query.trim()) return;

  try {
    const history = await getAiSearchHistory();
    const filteredHistory = history.filter(
      (item) => item.toLowerCase() !== query.toLowerCase(),
    );

    const newHistory = [query, ...filteredHistory].slice(0, MAX_HISTORY_LENGTH);
    await AsyncStorage.setItem(
      AI_SEARCH_HISTORY_KEY,
      JSON.stringify(newHistory),
    );
  } catch (e) {
    console.error("Failed to save AI search query", e);
  }
};

export const clearAiSearchHistory = async () => {
  try {
    await AsyncStorage.removeItem(AI_SEARCH_HISTORY_KEY);
  } catch (e) {
    console.error("Failed to clear AI search history", e);
  }
};
