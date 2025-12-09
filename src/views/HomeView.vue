<template>
  <div class="home-view min-h-screen bg-gray-900">
    <MenuBar />

    <main class="container mx-auto px-6 py-8">
      <div v-if="loading" class="text-center text-gray-400 py-12">
        {{ $t('home.loadingMovies') }}
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
        <div v-if="movies.length === 0" class="text-center text-gray-400 py-12">
          <p v-if="!hasLibraries">{{ $t('home.noLibraries') }}</p>
          <p v-else>{{ $t('home.noItems') }}</p>
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <MovieCard
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
          />
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
import MovieCard from '../components/MovieCard.vue'
import { libraries as libraryApi } from '@/api/client'

const { t } = useI18n()

const router = useRouter()

const movies = ref([])
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
      movies.value = []
      return
    }

    // Query each library for movies and aggregate them
    const allMovies = []
    for (const library of libraries.value) {
      try {
        const libraryMovies = await libraryApi.getLibraryMovies(library.id)
        allMovies.push(...libraryMovies)
      } catch (err) {
        console.error(`Failed to load movies from library ${library.id}:`, err)
        // Continue loading other libraries even if one fails
      }
    }

    // Remove duplicates based on movie ID (in case same movie appears in multiple libraries)
    const uniqueMovies = allMovies.reduce((acc, movie) => {
      if (!acc.find(m => m.id === movie.id)) {
        acc.push(movie)
      }
      return acc
    }, [])

    movies.value = uniqueMovies
  } catch (err) {
    console.error('Failed to load movies:', err)
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

