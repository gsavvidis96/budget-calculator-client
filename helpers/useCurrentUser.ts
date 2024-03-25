import { useCurrentUser as vuefireUseCurrentUser } from "vuefire";
import { type IdTokenResult } from "firebase/auth";

export const useCurrentUser = () => {
  const user = vuefireUseCurrentUser();
  const tokenResult = ref<IdTokenResult | undefined>();

  const currentUser = computed(() =>
    tokenResult.value?.claims?.userVerified ? user.value : null
  );

  watchEffect(async () => {
    tokenResult.value = await user.value?.getIdTokenResult();
  });

  return currentUser;
};
