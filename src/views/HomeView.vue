<template>
  <div class="home-view min-h-screen">
    <header class="bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <div class="container mx-auto px-6 py-4">
        <h1 class="text-3xl font-bold text-white">Ferelix</h1>
      </div>
    </header>

    <main class="container mx-auto px-6 py-8">
      <h2 class="text-2xl font-semibold mb-6 text-white">Movies</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <MovieCard
          v-for="movie in movies"
          :key="movie.id"
          :movie="movie"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MovieCard from '../components/MovieCard.vue'
import { getAllMovies } from '../data/mockMovies'

const movies = ref([])

onMounted(() => {
  movies.value = getAllMovies()
})
</script>

