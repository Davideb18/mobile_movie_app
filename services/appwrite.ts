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
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const USER_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_USERS!;

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

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    // 1. Aggiungi questo:
    console.log("----- PROVO A SALVARE SU APPWRITE -----");
    console.log("Query:", query);

    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    // check if a record of that search has already been stored
    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];

      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        },
      );
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
    console.log("----- SUCCESSO! SALVATO -----");
  } catch (error) {
    // 3. Se c'è un errore nascosto, lo vedrai qui:
    console.error("----- ERRORE APPWRITE -----", error);
    throw error;
  }

  // if a document is found increment the searchCount filed
  // if no document found
  // create a new document in Appwrite database -> 1
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);
    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
