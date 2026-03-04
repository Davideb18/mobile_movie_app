import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
} from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const USER_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_USERS!;
const SAVED_MOVIES_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_SAVED_MOVIES!;

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(PROJECT_ID!);

const database = new Databases(client);

export const account = new Account(client);
export const avatars = new Avatars(client);

export const createUser = async (
  email: string,
  password: string,
  username: string,
) => {
  try {
    // create the Appwrite account; ID.unique() generates a random document ID
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
    );

    if (!newAccount) throw Error;

    // build the avatar URL from the user's initials
    const avatarUrl = avatars.getInitialsURL(username).href;

    // sign the user in right away so we have an active session
    await signIn(email, password);

    // store the user profile in the database
    const newUser = await database.createDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      },
    );
    return newUser;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const sessione = await account.createEmailPasswordSession(email, password);

    return sessione;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    // check if there's already an active session
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    // look up the user's profile document by their account ID
    const currentUser = await database.listDocuments(
      DATABASE_ID,
      USER_COLLECTION_ID,
      [Query.equal("accountId", currentAccount.$id)],
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    return null;
  }
};

export const logout = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw error;
  }
};

export const savemovieToAppwrite = async (
  accountId: string,
  movie: any,
  category: string,
) => {
  try {
    const result = await database.createDocument(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      ID.unique(),
      {
        accountId: accountId,
        movieId: movie.id,
        category: category,
        movieDetails: JSON.stringify(movie),
      },
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const getSavedMoviesFromAppwrite = async (accountId: string) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [Query.equal("accountId", accountId)],
    );

    const dictionary: Record<string, any[]> = {
      "Want to Watch": [],
      "Already Watched": [],
    };

    result.documents.forEach((doc) => {
      // Create the category if it doesn't exist yet
      if (!dictionary[doc.category]) {
        dictionary[doc.category] = [];
      }

      // If the document has movie details, parse and add it
      if (doc.movieDetails) {
        try {
          const movieObj = JSON.parse(doc.movieDetails);
          // attach the Appwrite creation timestamp so we can use it for monthly stats
          movieObj.$createdAt = doc.$createdAt;
          dictionary[doc.category].push(movieObj);
        } catch (e) {}
      }
    });
    return dictionary;
  } catch (error) {
    return { "Want to Watch": [], "Already Watched": [] };
  }
};

export const removeMovieFromAppwrite = async (
  accountId: string,
  movieId: number,
  category: string,
) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [
        Query.equal("accountId", accountId),
        Query.equal("movieId", movieId),
        Query.equal("category", category),
      ],
    );

    if (result.documents.length > 0) {
      const documentIdSecret = result.documents[0].$id;

      await database.deleteDocument(
        DATABASE_ID,
        SAVED_MOVIES_COLLECTION_ID,
        documentIdSecret,
      );
    }
  } catch (error) {
    throw error;
  }
};

export const deleteCategoryFromAppwrite = async (
  accountId: string,
  category: string,
) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [Query.equal("accountId", accountId), Query.equal("category", category)],
    );

    // Delete all matching documents in parallel
    if (result.documents.length > 0) {
      const deletePromises = result.documents.map((doc) =>
        database.deleteDocument(
          DATABASE_ID,
          SAVED_MOVIES_COLLECTION_ID,
          doc.$id,
        ),
      );
      await Promise.all(deletePromises);
    }
  } catch (error) {
    throw error;
  }
};
