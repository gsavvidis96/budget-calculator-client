import { getCurrentUser } from "@/helpers/getCurrentUser";

export default defineNuxtRouteMiddleware(async () => {
  const user = await getCurrentUser();

  // redirect the user to the login page
  if (user) {
    return navigateTo({
      path: "/budgets",
      replace: true,
    });
  }
});
