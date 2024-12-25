import { useConfigurationStore } from "../store/configuration";
import { storeToRefs } from "pinia";

export function useConfig() {
  const configStore = useConfigurationStore();

  const { configurations, isLoading } = storeToRefs(configStore);

  const fetchConfigurations = async () => {
    try {
      await configStore.fetchConfigurations();
    } catch (error) {
      console.error("[useConfig] Failed to fetch configurations:", error);
    }
  };

  return {
    configurations,
    isLoading,
    fetchConfigurations,
  };
}
