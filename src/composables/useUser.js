import { ref, computed } from 'vue'
import { auth, isAuthenticated as checkAuth } from '@/api/client'

// Reactive state for current user
const currentUser = ref(null)
const isLoading = ref(false)

/**
 * Composable for managing user state and authentication
 */
export function useUser() {
  // Computed properties for easy access
  const isAuthenticated = computed(() => !!currentUser.value)
  const isAdmin = computed(() => currentUser.value?.is_admin === true)
  const user = computed(() => currentUser.value)

  /**
   * Load current user information
   */
  async function loadUser() {
    if (!checkAuth()) {
      currentUser.value = null
      return null
    }

    isLoading.value = true
    try {
      const userData = await auth.getCurrentUser()
      currentUser.value = userData
      return userData
    } catch (error) {
      console.error('Failed to load user:', error)
      currentUser.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Clear user data (on logout)
   */
  function clearUser() {
    currentUser.value = null
  }

  /**
   * Update user data
   */
  function updateUser(userData) {
    currentUser.value = { ...currentUser.value, ...userData }
  }

  return {
    // State
    user,
    isAuthenticated,
    isAdmin,
    isLoading,

    // Methods
    loadUser,
    clearUser,
    updateUser
  }
}
