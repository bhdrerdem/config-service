import { storeToRefs } from "pinia";
import { useOverrideStore, type Override } from "../store/override";
import { computed } from "vue";

export function useOverride() {
  const overrideStore = useOverrideStore();

  const { overrides, isLoading } = storeToRefs(overrideStore);

  const customOverrides = computed(() => {
    return overrides.value.map((override) => {
      return {
        id: override.id,
        value: override.value,
        audience: override.audience.name,
        parameterKey: override.configuration.parameterKey,
      };
    });
  });

  const fetchOverrides = async () => {
    await overrideStore.fetchOverrides();
  };

  const deleteOverride = async (override: Override) => {
    await overrideStore.deleteOverride(override);
  };

  const updateOverride = async (override: Override) => {
    await overrideStore.updateOverride(override);
  };

  const createOverride = async (override: Override) => {
    await overrideStore.createOverride(override);
  };

  return {
    overrides,
    customOverrides,
    isLoading,
    fetchOverrides,
    deleteOverride,
    updateOverride,
    createOverride,
  };
}
