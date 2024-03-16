import { getCurrentUser } from "vuefire";

export const getJwt = async () => {
  try {
    const user = await getCurrentUser();

    const idToken = await user?.getIdToken();

    return idToken;
  } catch (e) {
    throw e;
  }
};
