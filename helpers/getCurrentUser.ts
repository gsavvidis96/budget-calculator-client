import { getCurrentUser as vuefireGetCurrentUser } from "vuefire";
import { signOut, getAuth } from "firebase/auth";

export const getCurrentUser = async () => {
  const user = await vuefireGetCurrentUser();

  const tokenResult = await user?.getIdTokenResult();

  if (user && !tokenResult?.claims?.userVerified) {
    const auth = getAuth();

    await signOut(auth);

    return null;
  }

  return user;
};
