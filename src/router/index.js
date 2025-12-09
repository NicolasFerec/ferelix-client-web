import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MovieDetailView from '../views/MovieDetailView.vue'
import LoginView from '../views/LoginView.vue'
import SetupView from '../views/SetupView.vue'
import UserSettingsView from '../views/UserSettingsView.vue'
import { isAuthenticated } from '@/api/client'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/movie/:id',
      name: 'movie-detail',
      component: MovieDetailView,
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
    }
  ]
})

// Global navigation guard for authentication
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/setup']
  const authRequired = !publicPages.includes(to.path)
  
  if (authRequired && !isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})

export default router

