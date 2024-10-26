import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../pages/firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  async function googleSignIn() {
    const provider = new GoogleAuthProvider();

    // Add scopes to request additional permissions
    provider.addScope("https://www.googleapis.com/auth/userinfo.profile");
    provider.addScope("https://www.googleapis.com/auth/userinfo.email");
    provider.addScope("https://www.googleapis.com/auth/calendar");
    provider.addScope("https://www.googleapis.com/auth/calendar.events");

    // Add more scopes if necessary...

    try {
      const result = await signInWithPopup(auth, provider);

      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;

      // Optionally log or use the user and token as needed
      console.log("User:", user);
      console.log("Access Token:", token);

      return { user, token }; // You can return the user and token if needed
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;

      // The email of the user's account used (if available)
      const email = error.customData?.email || null;

      // The AuthCredential type that was used (if available)
      const credential = GoogleAuthProvider.credentialFromError(error);

      console.error("Error during Google sign-in:", errorMessage, {
        code: errorCode,
        email: email,
        credential: credential,
      });
    }
  }

  async function register(email, password) {
    const res = await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        setUser(user);

        // uid = user.uid;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error Signing you in: ", errorMessage);
        // ..
      });
  }

  async function login(email, password) {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        console.log("User logged in: ", user);
        // uid = user.uid;
      });
    } catch (error) {
      console.log("Error logging in: ", error);
    }
  }

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, register, login, googleSignIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
