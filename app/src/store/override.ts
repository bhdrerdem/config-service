import { defineStore } from "pinia";
import { useApi } from "../composables/useApi";
import type { Audience } from "./audience";
import type { Configuration } from "./configuration";

export interface Override {
  id: string;
  audience: Audience;
  configuration: Configuration;
  value: string;
}

interface OverrideState {
  overrides: Override[];
  isLoading: boolean;
  error: string;
}

export const useOverrideStore = defineStore("override", {
  state: (): OverrideState => ({
    overrides: [],
    isLoading: false,
    error: "",
  }),

  actions: {
    async fetchOverrides() {
      this.isLoading = true;
      try {
        const response = await useApi().axiosInstance.get("/overrides");
        if (response.data && Array.isArray(response.data)) {
          this.overrides = response.data.map((c: any) => ({
            id: c.id,
            audience: c.audience,
            configuration: c.configuration,
            value: c.value,
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
    async updateOverride(override: Override) {
      this.isLoading = true;
      try {
        const response = await useApi().axiosInstance.put(
          `/overrides/${override.id}`,
          override
        );
        if (response.data) {
          const index = this.overrides.findIndex((c) => c.id === override.id);
          if (index !== -1) {
            this.overrides[index] = {
              id: response.data.id,
              audience: response.data.audience,
              configuration: response.data.configuration,
              value: response.data.value,
            };
          }
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error: any) {
        console.log(error);
        this.error =
          error.response?.data?.error ||
          error.message ||
          "Something went wrong, please try again";
        throw new Error(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    async createOverride(override: Override) {
      this.isLoading = true;
      try {
        const response = await useApi().axiosInstance.post(
          "/overrides",
          override
        );
        if (response.data) {
          this.overrides.push({
            id: response.data.id,
            audience: response.data.audience,
            configuration: response.data.configuration,
            value: response.data.value,
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
    async deleteOverride(override: Override) {
      this.isLoading = true;
      try {
        await useApi().axiosInstance.delete(`/overrides/${override.id}`);
        const index = this.overrides.findIndex((c) => c.id === override.id);
        if (index !== -1) {
          this.overrides.splice(index, 1);
        }
      } catch (error: any) {
        this.error =
          error.response?.data?.error ||
          "Something went wrong, please try again";
        throw new Error(this.error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
