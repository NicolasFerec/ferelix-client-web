<template>
  <div class="home-view min-h-screen bg-gray-900">
    <MenuBar />

    <main class="container mx-auto px-6 py-8">
      <div v-if="loading" class="text-center text-gray-400 py-12">
        {{ $t('home.loadingMediaFiles') }}
      </div>
      
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-400 mb-4">{{ error }}</p>
        <button
          @click="loadItems"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
        >
          {{ $t('common.retry') }}
        </button>
      </div>
      
      <div v-else>
        <h2 class="text-2xl font-semibold mb-6 text-white">{{ $t('home.library') }}</h2>
        <div v-if="!hasLibraries" class="text-center text-gray-400 py-12">
          <p>{{ $t('home.noLibraries') }}</p>
        </div>
        <div v-else-if="libraries.length === 0 || Object.keys(mediaFilesByLibrary).length === 0" class="text-center text-gray-400 py-12">
          <p>{{ $t('home.noItems') }}</p>
        </div>
        <div v-else>
          <div v-for="library in libraries" :key="library.id" class="mb-12">
            <h3 class="text-xl font-semibold mb-4 text-white">
              {{ library.name }}
              <span class="text-sm text-gray-400 font-normal ml-2">{{ library.path }}</span>
            </h3>
            <div v-if="mediaFilesByLibrary[library.id] && mediaFilesByLibrary[library.id].length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              <MediaCard
                v-for="mediaFile in mediaFilesByLibrary[library.id]"
                :key="mediaFile.id"
                :mediaFile="mediaFile"
              />
            </div>
            <div v-else class="text-gray-500 text-sm py-4">
              {{ $t('home.noItems') }}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MenuBar from '../components/MenuBar.vue'
import MediaCard from '../components/MediaCard.vue'
import { libraries as libraryApi } from '@/api/client'

const { t } = useI18n()

const router = useRouter()

const mediaFilesByLibrary = ref({})
const libraries = ref([])
const loading = ref(false)
const error = ref('')
const hasLibraries = ref(false)

async function loadLibraries() {
  try {
    libraries.value = await libraryApi.getLibraries()
    hasLibraries.value = libraries.value.length > 0
  } catch (err) {
    console.error('Failed to load libraries:', err)
    // If libraries fail to load, treat it as no libraries configured
    hasLibraries.value = false
    libraries.value = []
  }
}

async function loadItems() {
  loading.value = true
  error.value = ''
  
  try {
    // First, ensure we have libraries loaded
    if (libraries.value.length === 0) {
      await loadLibraries()
    }

    // If no libraries exist, show empty state (not an error)
    if (!hasLibraries.value) {
      mediaFilesByLibrary.value = {}
      return
    }

    // Query each library for media files and store them per library
    const mediaFilesMap = {}
    for (const library of libraries.value) {
      try {
        const libraryMediaFiles = await libraryApi.getLibraryItems(library.id)
        mediaFilesMap[library.id] = libraryMediaFiles
      } catch (err) {
        console.error(`Failed to load media files from library ${library.id}:`, err)
        // Continue loading other libraries even if one fails
        mediaFilesMap[library.id] = []
      }
    }

    mediaFilesByLibrary.value = mediaFilesMap
  } catch (err) {
    console.error('Failed to load media files:', err)
    // Only show error for actual API failures (network/server errors)
    // Successful API calls that return empty arrays are handled above
    error.value = t('home.loadFailed')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadItems()
})
</script>




