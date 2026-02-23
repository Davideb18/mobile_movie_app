// track the searches made by a user
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID_METRICS!;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const USER_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_USERS!;
const SAVED_MOVIES_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_SAVED_MOVIES!;

// AGGIUNGI QUESTI LOG:
console.log("--- DEBUG APPWRITE CONFIG ---");
console.log("Endpoint:", "https://sfo.cloud.appwrite.io/v1");
console.log("Project ID:", PROJECT_ID); // <--- Se questo è undefined o vuoto, è qui l'errore
console.log("-----------------------------");

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(PROJECT_ID!);

const database = new Databases(client);

export const account = new Account(client);
export const avatars = new Avatars(client); // to create the logo in the case the user don't add an image

// create the 'createuser' function
export const createUser = async (
  email: string,
  password: string,
  username: string,
) => {
  try {
    // 1. Chiediamo ad Appwrite di creare un nuovo Account
    // ID.unique() genera un ID univoco automatico
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
    );

    if (!newAccount) throw Error;

    // 2. Generate the URL for the avatar with the initial letters
    const avatarUrl = avatars.getInitials(username).toString();

    // 3. Login the user
    await signIn(email, password);

    // 4. save the user data in the database
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
    console.log("errore registrazione:", error);
    throw error;
  }
};

// crate the 'signIn' function
export const signIn = async (email: string, password: string) => {
  try {
    // create a email/password sessione
    const sessione = await account.createEmailPasswordSession(email, password);

    return sessione;
  } catch (error) {
    console.log("errore login:", error);
    throw error;
  }
};

// create function to control if a user is logged in
export const getCurrentUser = async () => {
  try {
    // 1. ask to appwrite if there's a current active session
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    // 2. if there is find the accou tdetails o the database using the userId
    const currentUser = await database.listDocuments(
      DATABASE_ID,
      USER_COLLECTION_ID,
      [Query.equal("accountId", currentAccount.$id)],
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log("Errore nella verifica del login", error);
    return null;
  }
};

// create function to logout
export const logout = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log("Errore logout:", error);
    throw error;
  }
};

// create function to save a movie to the database
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
        movieDetails: JSON.stringify(movie), // convert the movie object to a string
      },
    );
    return result;
  } catch (error) {
    console.log("Errore salvataggio film su Appwrite", error);
    throw error;
  }
};

// create function to get the saved movies from the database
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
      const movieObj = JSON.parse(doc.movieDetails);

      if (dictionary[doc.category]) {
        dictionary[doc.category].push(movieObj);
      }
    });
    return dictionary; // Restituiamo il dizionario bello formattato!
  } catch (error) {
    console.log("Errore fetch film salvati da Appwrite", error);
    // In caso di errore, restituisci scatole vuote per non far crashare l'app
    return { "Want to Watch": [], "Already Watched": [] };
  }
};

// create function to remove a movie from the database
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
    console.log("Errore rimozione film da Appwrite", error);
    throw error;
  }
};
