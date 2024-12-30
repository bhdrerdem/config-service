import { useAudienceStore, type Audience } from "../store/audience";
import { storeToRefs } from "pinia";

export function useAudience() {
  const audienceStore = useAudienceStore();

  const { audiences, isLoading } = storeToRefs(audienceStore);

  const fetchAudiences = async () => {
    await audienceStore.fetchAudiences();
  };

  const deleteAudience = async (audience: Audience) => {
    await audienceStore.deleteAudience(audience);
  };

  const updateAudience = async (audience: Audience) => {
    await audienceStore.updateAudience(audience);
  };

  const createAudience = async (audience: Audience) => {
    await audienceStore.createAudience(audience);
  };

  return {
    audiences,
    isLoading,
    fetchAudiences,
    deleteAudience,
    updateAudience,
    createAudience,
  };
}
