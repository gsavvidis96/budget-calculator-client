import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import BudgetList from '@/views/budget-list-view/BudgetList.vue'
import BudgetView from '@/views/budget-view/BudgetView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/:pathMatch(.*)*', redirect: '/' },
    {
      path: '/',
      redirect: '/budgets',
    },
    {
      path: '/budgets',
      component: BudgetList,
    },
    {
      path: '/budgets/:id',
      component: BudgetView,
    },
    {
      path: '/login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
  ],
})

router.beforeEach(async (to) => {
  // Remove hash from url (from supabase login)
  if (to.hash)
    return {
      path: to.path,
      replace: true,
    }

  const { data } = await supabase.auth.getClaims()

  // Redirect logged-in users away from auth pages
  if (data?.claims && to.meta.requiresAuth === false) {
    return {
      path: '/',
    }
  }

  // Allow public routes for non-authenticated users
  if (to.meta.requiresAuth === false) {
    return
  }

  // Check authentication for protected routes
  if (!data?.claims)
    return {
      path: '/login',
      state: { redirect: to.fullPath },
    }
})
export default router
