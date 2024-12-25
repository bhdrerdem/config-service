import { defineStore } from "pinia";
import axiosInstance from "../api";

interface Configuration {
  id: string;
  parameterKey: string;
  value: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

interface ConfigurationState {
  configurations: Configuration[];
  isLoading: boolean;
}

export const useConfigurationStore = defineStore("configuration", {
  state: (): ConfigurationState => ({
    configurations: [],
    isLoading: false,
  }),

  actions: {
    async fetchConfigurations() {
      this.isLoading = true;
      const response = await axiosInstance("/configurations");
      this.configurations = response.data;
      this.isLoading = false;
    },
  },
});
