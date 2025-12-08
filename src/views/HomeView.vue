<template>
  <div class="home-view min-h-screen">
    <header class="bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-white">Ferelix</h1>
        <button
          @click="handleLogout"
          class="px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Logout
        </button>
      </div>
    </header>

    <main class="container mx-auto px-6 py-8">
      <div v-if="loading" class="text-center text-gray-400 py-12">
        Loading movies...
      </div>
      
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-400 mb-4">{{ error }}</p>
        <button
          @click="loadMovies"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
        >
          Retry
        </button>
      </div>
      
      <div v-else>
        <h2 class="text-2xl font-semibold mb-6 text-white">Movies</h2>
        <div v-if="movies.length === 0" class="text-center text-gray-400 py-12">
          No movies found. Add library paths to scan for media.
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
import MovieCard from '../components/MovieCard.vue'
import { media, auth } from '@/api/client'

const router = useRouter()

const movies = ref([])
const loading = ref(false)
const error = ref('')

async function loadMovies() {
  loading.value = true
  error.value = ''
  
  try {
    movies.value = await media.getMovies()
  } catch (err) {
    console.error('Failed to load movies:', err)
    error.value = 'Failed to load movies. Please try again.'
  } finally {
    loading.value = false
  }
}

async function handleLogout() {
  try {
    await auth.logout()
    router.push('/login')
  } catch (err) {
    console.error('Logout failed:', err)
    // Still redirect to login even if API call fails
    router.push('/login')
  }
}

onMounted(() => {
  loadMovies()
})
</script>

