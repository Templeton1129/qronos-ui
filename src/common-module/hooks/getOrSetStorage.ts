import { computed } from "vue";
import { useStorage } from "@vueuse/core";

export function useStorageValueOrFn() {
  const gaToken = useStorage<string | null>("gaToken", null);
  const sessionGAtoken = useStorage<string | null>(
    "gaToken",
    null,
    sessionStorage
  );
  const localStorageWxtoken = useStorage<string | null>("wxToken", null);

  const viewIsBoundGA = computed(() => !!gaToken.value);
  const viewIsHaveSessionGAtoken = computed(() => !!sessionGAtoken.value);
  const getIsLoggedInWX = computed(() => !!userInfo.value);

  const userInfo = useStorage<string | null>("user-info", null);

  const getApiKeyAndUuid = computed(() => {
    if (userInfo.value) {
      const { apiKey, uuid } = JSON.parse(userInfo.value);
      return { apiKey, uuid };
    }
    return { apiKey: null, uuid: null };
  });

  const themeMode = useStorage<string>("themeMode", "system");

  const dataLogRefreshTime = useStorage<string>("datalogRefreshTime", "0");
  const strategyLogRefreshTime = useStorage<string>(
    "strategylogRefreshTime",
    "0"
  );

  return {
    gaToken,
    sessionGAtoken,
    localStorageWxtoken,
    viewIsBoundGA,
    viewIsHaveSessionGAtoken,
    getIsLoggedInWX,
    userInfo,
    getApiKeyAndUuid,
    themeMode,
    dataLogRefreshTime,
    strategyLogRefreshTime,
  };
}
