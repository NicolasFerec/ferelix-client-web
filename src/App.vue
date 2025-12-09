<template>
  <div id="app" class="min-h-screen bg-gray-900">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUser } from '@/composables/useUser'

const { locale } = useI18n()
const { loadUser } = useUser()

// Load user information on app start if authenticated
onMounted(async () => {
  const user = await loadUser()
  if (user && user.language) {
    locale.value = user.language
  }
})
</script>

