import { defineStore } from "pinia";
import { signInWithEmailAndPassword, type User } from "firebase/auth";
import { auth } from "../firebase";

interface AuthState {
  isLoading: boolean;
  user: User | null;
  error: string;
}

export const useAuthStore = defineStore("user", {
  state: (): AuthState => ({
    isLoading: true,
    user: null,
    error: "",
  }),

  actions: {
    setLoading(loading: boolean) {
      this.isLoading = loading;
    },
    setUser(user: User | null) {
      this.user = user;
    },
    async signin(email: string, password: string) {
      this.isLoading = true;
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error: any) {
        if (error?.code == "auth/invalid-credential") {
          this.error = "Invalid email or password";
        } else {
          this.error = error?.message || "Failed to sign in";
        }
      } finally {
        this.isLoading = false;
      }
    },
    async signout() {
      this.isLoading = true;
      try {
        await auth.signOut();
      } catch (error: any) {
        throw new Error(error?.message || "Failed to sign out");
      } finally {
        this.isLoading = false;
      }
    },
  },
});
