import {
  useConfigurationStore,
  type Configuration,
} from "../store/configuration";
import { storeToRefs } from "pinia";

export function useConfig() {
  const configStore = useConfigurationStore();

  const { configurations, isLoading } = storeToRefs(configStore);

  const fetchConfigurations = async () => {
    await configStore.fetchConfigurations();
  };

  const deleteConfiguration = async (config: Configuration) => {
    await configStore.deleteConfiguration(config);
  };

  const updateConfiguration = async (config: Configuration) => {
    await configStore.updateConfiguration(config);
  };

  const createConfiguration = async (config: Configuration) => {
    await configStore.createConfiguration(config);
  };

  return {
    configurations,
    isLoading,
    fetchConfigurations,
    deleteConfiguration,
    updateConfiguration,
    createConfiguration,
  };
}
