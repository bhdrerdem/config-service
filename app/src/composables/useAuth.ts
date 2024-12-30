// composables/useAuth.ts
import { storeToRefs } from "pinia";
import { useAuthStore } from "../store/auth";
import { type User } from "firebase/auth";
export function useAuth() {
  const authStore = useAuthStore();
  const { isLoading, user, error } = storeToRefs(authStore);

  async function signin(email: string, password: string) {
    await authStore.signin(email, password);
  }

  async function signout() {
    await authStore.signout();
  }

  function setUser(user: User | null) {
    authStore.setUser(user);
  }

  function setIsLoading(isLoading: boolean) {
    authStore.isLoading = isLoading;
  }

  return {
    user,
    isLoading,
    error,
    signin,
    signout,
    setUser,
    setIsLoading,
  };
}
