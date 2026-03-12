export interface AIRecommendationResult {
  topMovie: string;
  description: string;
  otherMovies: string[];
}

export const fetchAIRecommendations = async (
  query: string,
): Promise<AIRecommendationResult> => {
  // NOTE: In a production app, this API key should be hidden behind a secure backend proxy.
  // For this portfolio CV project, it's accessed directly on the client for simplicity.
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Gemini API key is not configured. Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env file.",
    );
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const prompt = `
    You are a movie recommendation engine that understands queries in any language, including Italian.
    The user is looking for a movie with the following vibe, description, or title hint: "${query}"

    The user may write in Italian or use Italian movie/character names. Understand their intent and find the best matching movie.

    1. Choose a SINGLE best match movie ("topMovie"). Always use the INTERNATIONAL (English) title.
    2. Write a short, engaging description (1-2 sentences) of exactly WHY this specific movie fits the user's request ("description"). Write it in Italian if the query was in Italian, otherwise write it in English.
    3. Choose 9 other good movie recommendations ("otherMovies"). Always use the INTERNATIONAL (English) titles.

    Return the response ONLY as a JSON object, without any markdown formatting or extra text.
    Example:
    {
      "topMovie": "Lone Survivor",
      "description": "Questo film racconta l'operazione Red Wings, una missione militare in Afghanistan dove quasi tutti i soldati americani perirono in una delle battaglie più intense della storia recente.",
      "otherMovies": ["Black Hawk Down", "Zero Dark Thirty", "Hacksaw Ridge", "Lone Survivor", "Black Hawk Down", "Zero Dark Thirty", "Hacksaw Ridge", "Lone Survivor", "Black Hawk Down", "Zero Dark Thirty", "Hacksaw Ridge"]
    }
  `;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(
        `Gemini API Error: [${response.status}] ${response.statusText}`,
        errText,
      );
      throw new Error(`Failed to fetch AI recommendations: ${response.status}`);
    }

    const data = await response.json();

    // Extract the text content from the Gemini response structure
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      throw new Error("Invalid response format from Gemini API");
    }

    try {
      // Parse the JSON object
      const cleanText = aiText
        .replace(/\`\`\`json/g, "")
        .replace(/\`\`\`/g, "")
        .trim();
      const result: AIRecommendationResult = JSON.parse(cleanText);

      if (
        !result.topMovie ||
        !result.description ||
        !Array.isArray(result.otherMovies)
      ) {
        throw new Error("Parsed result is missing required fields");
      }

      return result;
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiText);
      throw new Error(
        "Could not parse the AI recommendations into the expected format.",
      );
    }
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};
