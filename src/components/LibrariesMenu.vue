<template>
  <nav class="bg-gray-800/95 backdrop-blur-sm border-b border-gray-700">
    <div class="container mx-auto px-6 py-3">
      <div class="flex items-center space-x-4">
        <span class="text-sm font-medium text-gray-400">{{ $t('common.libraries') }}:</span>
        <div class="flex items-center space-x-2">
          <router-link
            v-for="library in libraries"
            :key="library.id"
            :to="`/library/${library.id}`"
            class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
            :class="isActive(library.id) 
              ? 'text-white bg-indigo-600 hover:bg-indigo-700' 
              : 'text-gray-300 hover:text-white hover:bg-gray-700'"
          >
            {{ library.name }}
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { libraries as libraryApi } from '@/api/client'

const route = useRoute()
const libraries = ref([])

function isActive(libraryId) {
  return route.name === 'library' && parseInt(route.params.id) === libraryId
}

async function loadLibraries() {
  try {
    libraries.value = await libraryApi.getLibraries()
  } catch (err) {
    console.error('Failed to load libraries:', err)
    libraries.value = []
  }
}

onMounted(async () => {
  await loadLibraries()
})
</script>

