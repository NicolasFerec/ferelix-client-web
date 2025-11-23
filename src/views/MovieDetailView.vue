<template>
  <div class="movie-detail-view min-h-screen">
    <div v-if="movie" class="relative">
      <!-- Backdrop -->
      <div class="relative h-64 md:h-96 overflow-hidden">
        <img
          :src="movie.backdropUrl || movie.posterUrl"
          :alt="movie.title"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900"></div>
        
        <!-- Back Button -->
        <button
          @click="goBack"
          class="absolute top-4 left-4 z-20 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200 flex items-center justify-center"
          aria-label="Go back"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="container mx-auto px-6 py-8 -mt-32 relative z-10">
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Poster -->
          <div class="flex-shrink-0">
            <img
              :src="movie.posterUrl"
              :alt="movie.title"
              class="w-48 md:w-64 rounded-lg shadow-2xl"
            />
          </div>

          <!-- Info -->
          <div class="flex-1 text-white">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ movie.title }}</h1>
            <div class="flex items-center gap-4 mb-4 text-gray-300">
              <span>{{ movie.year }}</span>
              <span>•</span>
              <span>{{ movie.genre }}</span>
              <span>•</span>
              <span>{{ formatDuration(movie.duration) }}</span>
            </div>
            <p class="text-lg text-gray-300 mb-6 leading-relaxed">{{ movie.description }}</p>
            <button
              @click="showPlayer = true"
              class="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Play
            </button>
          </div>
        </div>

        <!-- Video Player Section -->
        <div v-if="showPlayer" class="mt-8">
          <div class="bg-black rounded-lg overflow-hidden">
            <VideoPlayer :hls-url="movie.hlsUrl" />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="container mx-auto px-6 py-8 text-center text-white">
      <p class="text-xl">Movie not found</p>
      <router-link to="/" class="text-primary-400 hover:text-primary-300 mt-4 inline-block">
        Back to home
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VideoPlayer from '../components/VideoPlayer.vue'
import { getMovieById } from '../data/mockMovies'

const route = useRoute()
const router = useRouter()
const showPlayer = ref(false)

const movie = computed(() => {
  return getMovieById(route.params.id)
})

function goBack() {
  router.push('/')
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}
</script>

