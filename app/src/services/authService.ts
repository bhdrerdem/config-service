import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
} from "firebase/auth";

export async function loginUser(
  email: string,
  password: string
): Promise<void> {
  try {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("[loginUser] error:", error);
    throw new Error("Invalid credentials  provided");
  }
}

export async function logoutUser(): Promise<void> {
  try {
    const auth = getAuth();
    await signOut(auth);
    await setPersistence(auth, browserLocalPersistence);
    console.log("User logged out");
  } catch (error) {
    console.error("[logoutUser] error:", error);
    throw new Error("Failed to logout");
  }
}
