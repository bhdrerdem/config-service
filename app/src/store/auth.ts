import { defineStore } from "pinia";
import { type User } from "firebase/auth";

interface UserState {
  isLoading: boolean;
  user: User | null;
}

export const useAuthStore = defineStore("user", {
  state: (): UserState => ({
    isLoading: false,
    user: null,
  }),

  actions: {
    setLoading(loading: boolean) {
      this.isLoading = loading;
    },
    setUser(user: User | null) {
      this.user = user;
    },
  },
});
