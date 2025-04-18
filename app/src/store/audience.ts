import { defineStore } from "pinia";
import { useApi } from "../composables/useApi";

export interface Audience {
  name: string;
  description: string;
}

interface AudienceState {
  audiences: Audience[];
  isLoading: boolean;
  error: string;
}

export const useAudienceStore = defineStore("audience", {
  state: (): AudienceState => ({
    audiences: [],
    isLoading: false,
    error: "",
  }),

  actions: {
    async fetchAudiences() {
      this.isLoading = true;
      try {
        const response = await useApi().axiosInstance.get("/audiences");
        if (response.data && Array.isArray(response.data)) {
          this.audiences = response.data.map((c: any) => ({
            name: c.name,
            description: c.description,
          }));
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error: any) {
        this.error =
          error.response?.data?.error ||
          error.message ||
          "Something went wrong, please try again";
        throw new Error(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    async updateAudience(audience: Audience) {
      this.isLoading = true;
      try {
        const response = await useApi().axiosInstance.put(
          `/audiences/${audience.name}`,
          audience
        );
        if (response.data) {
          const index = this.audiences.findIndex(
            (c) => c.name === audience.name
          );
          if (index !== -1) {
            this.audiences[index] = {
              name: response.data.name,
              description: response.data.description,
            };
          }
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error: any) {
        this.error =
          error.response?.data?.error ||
          error.message ||
          "Something went wrong, please try again";
        throw new Error(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    async createAudience(audience: Audience) {
      this.isLoading = true;
      try {
        const response = await useApi().axiosInstance.post(
          "/audiences",
          audience
        );
        if (response.data) {
          this.audiences.push({
            name: response.data.name,
            description: response.data.description,
          });
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error: any) {
        this.error =
          error.response?.data?.error ||
          error.message ||
          "Something went wrong, please try again";
        throw new Error(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    async deleteAudience(audience: Audience) {
      this.isLoading = true;
      try {
        await useApi().axiosInstance.delete(`/audiences/${audience.name}`);
        const index = this.audiences.findIndex((c) => c.name === audience.name);
        if (index !== -1) {
          this.audiences.splice(index, 1);
        }
      } catch (error: any) {
        this.error =
          error.response?.data?.error ||
          error.message ||
          "Something went wrong, please try again";
        throw new Error(this.error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
