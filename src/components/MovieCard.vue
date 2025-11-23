<template>
  <div
    class="movie-card cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
    @click="handleClick"
  >
    <div class="relative overflow-hidden rounded-lg bg-gray-800 shadow-lg">
      <img
        :src="movie.posterUrl"
        :alt="movie.title"
        class="w-full h-auto object-cover"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div class="absolute bottom-0 left-0 right-0 p-4">
          <h3 class="text-white font-bold text-lg mb-1">{{ movie.title }}</h3>
          <p class="text-gray-300 text-sm line-clamp-2">{{ movie.description }}</p>
          <div class="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <span>{{ movie.year }}</span>
            <span>•</span>
            <span>{{ movie.genre }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const router = useRouter()

function handleClick() {
  router.push({ name: 'movie-detail', params: { id: props.movie.id } })
}
</script>

<style scoped>
.movie-card {
  aspect-ratio: 2 / 3;
}
</style>

