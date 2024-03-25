import { getCurrentUser } from "@/helpers/getCurrentUser";
export default defineNuxtRouteMiddleware(async (to) => {
  const user = await getCurrentUser();

  // redirect the user to the login page
  if (!user) {
    return navigateTo({
      path: "/login",
      query: {
        redirect: to.fullPath,
      },
      replace: true,
    });
  }
});
