import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MediaDetailView from '../views/MediaDetailView.vue'
import LoginView from '../views/LoginView.vue'
import SetupView from '../views/SetupView.vue'
import UserSettingsView from '../views/UserSettingsView.vue'
import DashboardView from '../views/DashboardView.vue'
import LibraryView from '../views/LibraryView.vue'
import { isAuthenticated, auth } from '@/api/client'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/media/:id',
      name: 'media-detail',
      component: MediaDetailView,
      props: true
    },
    {
      path: '/library/:id',
      name: 'library',
      component: LibraryView,
      props: true
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/setup',
      name: 'setup',
      component: SetupView
    },
    {
      path: '/settings',
      name: 'settings',
      component: UserSettingsView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    }
  ]
})

// Global navigation guard for authentication and admin routes
router.beforeEach(async (to, from, next) => {
  const publicPages = ['/login', '/setup']
  const authRequired = !publicPages.includes(to.path)
  const adminPages = ['/dashboard']
  
  // Check authentication
  if (authRequired && !isAuthenticated()) {
    next('/login')
    return
  }
  
  // Check admin access for admin-only pages
  if (adminPages.includes(to.path)) {
    try {
      const user = await auth.getCurrentUser()
      if (!user || !user.is_admin) {
        next('/')
        return
      }
    } catch (error) {
      console.error('Failed to check admin status:', error)
      next('/')
      return
    }
  }
  
  next()
})

export default router

