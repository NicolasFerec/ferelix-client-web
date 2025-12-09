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
          @click="loadMovies"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
        >
          {{ $t('common.retry') }}
        </button>
      </div>
      
      <div v-else>
        <h2 class="text-2xl font-semibold mb-6 text-white">{{ $t('home.movies') }}</h2>
        <div v-if="movies.length === 0" class="text-center text-gray-400 py-12">
          {{ $t('home.noMovies') }}
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
import { media } from '@/api/client'

const { t } = useI18n()

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
    error.value = t('home.loadFailed')
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  loadMovies()
})
</script>

