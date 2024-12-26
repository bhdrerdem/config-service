import { defineStore } from "pinia";
import { useApi } from "../composables/useApi";

export interface Configuration {
  id: string;
  parameterKey: string;
  value: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

interface ConfigurationState {
  configurations: Configuration[];
  isLoading: boolean;
  error: string;
}

export const useConfigurationStore = defineStore("configuration", {
  state: (): ConfigurationState => ({
    configurations: [],
    isLoading: false,
    error: "",
  }),

  actions: {
    async fetchConfigurations() {
      this.isLoading = true;
      try {
        const response = await useApi().axiosInstance.get("/configurations");
        if (response.data && Array.isArray(response.data)) {
          this.configurations = response.data.map((c: any) => ({
            id: c.id,
            parameterKey: c.parameterKey,
            value: c.value,
            description: c.description,
            createdAt: new Date(c.createdAt),
            updatedAt: new Date(c.updatedAt),
            version: c.version,
          }));
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error: any) {
        this.error = error?.message || "Failed to fetch configurations";
      }
      this.isLoading = false;
    },
    async updateConfiguration(config: Configuration) {
      this.isLoading = true;
      try {
        const response = await useApi().axiosInstance.put(
          `/configurations/${config.id}`,
          config
        );
        if (response.data && response.data.id === config.id) {
          const index = this.configurations.findIndex(
            (c) => c.id === config.id
          );
          if (index !== -1) {
            this.configurations[index] = {
              id: response.data.id,
              parameterKey: response.data.parameterKey,
              value: response.data.value,
              description: response.data.description,
              createdAt: new Date(response.data.createdAt),
              updatedAt: new Date(response.data.updatedAt),
              version: response.data.version,
            };
          }
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error: any) {
        this.error = error?.message || "Failed to update configuration";
      }
      this.isLoading = false;
    },
    async createConfiguration(config: Configuration) {
      this.isLoading = true;
      try {
        const response = await useApi().axiosInstance.post(
          "/configurations",
          config
        );
        if (response.data && response.data.id) {
          this.configurations.push({
            id: response.data.id,
            parameterKey: response.data.parameterKey,
            value: response.data.value,
            description: response.data.description,
            createdAt: new Date(response.data.createdAt),
            updatedAt: new Date(response.data.updatedAt),
            version: response.data.version,
          });
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error: any) {
        this.error = error?.message || "Failed to create configuration";
      }
      this.isLoading = false;
    },
    async deleteConfiguration(config: Configuration) {
      this.isLoading = true;
      try {
        await useApi().axiosInstance.delete(`/configurations/${config.id}`);
        const index = this.configurations.findIndex((c) => c.id === config.id);
        if (index !== -1) {
          this.configurations.splice(index, 1);
        }
      } catch (error: any) {
        this.error = error?.message || "Failed to delete configuration";
      }
      this.isLoading = false;
    },
  },
});
