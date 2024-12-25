// composables/useAuth.ts
import { storeToRefs } from "pinia";
import { useAuthStore } from "../store/auth";
import { loginUser, logoutUser } from "../services/authService";
import { type User } from "firebase/auth";
export function useAuth() {
  const userStore = useAuthStore();
  const { isLoading, user } = storeToRefs(userStore);

  async function signin(email: string, password: string) {
    try {
      userStore.setLoading(true);
      await loginUser(email, password);
    } catch (error) {
      console.error("[useAuth] login error:", error);
    } finally {
      userStore.setLoading(false);
    }
  }

  async function signout() {
    try {
      userStore.setLoading(true);
      await logoutUser();
    } catch (error) {
    } finally {
      userStore.setLoading(false);
    }
  }

  function setUser(user: User | null) {
    userStore.setUser(user);
  }

  return {
    user,
    isLoading,
    signin,
    signout,
    setUser,
  };
}
