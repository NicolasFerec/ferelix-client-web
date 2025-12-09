<template>
  <div id="app" class="min-h-screen bg-gray-900">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { isAuthenticated } from '@/api/client'
import { auth } from '@/api/client'

const { locale } = useI18n()

// Load user language preference on app start if authenticated
onMounted(async () => {
  if (isAuthenticated()) {
    try {
      const user = await auth.getCurrentUser()
      if (user && user.language) {
        locale.value = user.language
      }
    } catch (err) {
      console.error('Failed to load user preferences:', err)
      // Silently fail - user can still use the app
    }
  }
})
</script>

