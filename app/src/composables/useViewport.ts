import { ref, onMounted, onUnmounted } from "vue";

export function useViewport() {
  const isMobileView = ref(false);

  const mediaQuery = window.matchMedia("(max-width: 768px)");

  const updateMobileView = () => {
    isMobileView.value = mediaQuery.matches;
  };

  onMounted(() => {
    updateMobileView();
    mediaQuery.addEventListener("change", updateMobileView);
  });

  onUnmounted(() => {
    mediaQuery.removeEventListener("change", updateMobileView);
  });

  return {
    isMobileView,
  };
}
