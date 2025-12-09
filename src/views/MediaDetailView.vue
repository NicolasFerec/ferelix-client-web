<template>
  <div class="media-detail-view min-h-screen bg-gray-900">
    <MenuBar />
    <div v-if="loading" class="container mx-auto px-6 py-8 text-center text-gray-400">
      Loading media...
    </div>

    <div v-else-if="error" class="container mx-auto px-6 py-8 text-center">
      <p class="text-red-400 mb-4">{{ error }}</p>
      <button
        @click="loadMedia"
        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
      >
        Retry
      </button>
    </div>

    <div v-else-if="movie" class="relative">
      <!-- Backdrop -->
      <div class="relative h-64 md:h-96 overflow-hidden">
        <img
          v-if="movie.backdrop_url || movie.poster_url"
          :src="movie.backdrop_url || movie.poster_url"
          :alt="movie.title"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full bg-gray-800"></div>
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
              v-if="movie.poster_url"
              :src="movie.poster_url"
              :alt="movie.title"
              class="w-48 md:w-64 rounded-lg shadow-2xl"
            />
            <div v-else class="w-48 md:w-64 h-72 bg-gray-800 rounded-lg shadow-2xl flex items-center justify-center">
              <span class="text-gray-600">No poster</span>
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1 text-white">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ movie.title }}</h1>
            <div class="flex items-center gap-4 mb-4 text-gray-300">
              <span v-if="movie.year">{{ movie.year }}</span>
              <span v-if="movie.year">•</span>
              <span v-if="movie.genre">{{ movie.genre }}</span>
              <span v-if="movie.genre">•</span>
              <span v-if="movie.duration">{{ formatDuration(movie.duration) }}</span>
            </div>
            <p v-if="movie.description" class="text-lg text-gray-300 mb-6 leading-relaxed">{{ movie.description }}</p>
            
            <!-- MediaFile Information -->
            <div v-if="mediaFile" class="mb-6 p-4 bg-gray-800/50 rounded-lg">
              <h2 class="text-xl font-semibold mb-3">File Information</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span class="text-gray-400">File:</span>
                  <span class="ml-2 text-gray-300">{{ mediaFile.file_name }}</span>
                </div>
                <div v-if="mediaFile.duration">
                  <span class="text-gray-400">Duration:</span>
                  <span class="ml-2 text-gray-300">{{ formatDurationSeconds(mediaFile.duration) }}</span>
                </div>
                <div v-if="mediaFile.width && mediaFile.height">
                  <span class="text-gray-400">Resolution:</span>
                  <span class="ml-2 text-gray-300">{{ mediaFile.width }}x{{ mediaFile.height }}</span>
                </div>
                <div v-if="mediaFile.codec">
                  <span class="text-gray-400">Codec:</span>
                  <span class="ml-2 text-gray-300">{{ mediaFile.codec }}</span>
                </div>
                <div v-if="mediaFile.bitrate">
                  <span class="text-gray-400">Bitrate:</span>
                  <span class="ml-2 text-gray-300">{{ formatBitrate(mediaFile.bitrate) }}</span>
                </div>
                <div>
                  <span class="text-gray-400">Size:</span>
                  <span class="ml-2 text-gray-300">{{ formatFileSize(mediaFile.file_size) }}</span>
                </div>
              </div>
            </div>

            <button
              v-if="movie.media_file_id"
              @click="handlePlayClick"
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
        <div v-if="showPlayer && movie.media_file_id" class="mt-8">
          <div class="bg-black rounded-lg overflow-hidden">
            <VideoPlayer 
              :key="movie.media_file_id" 
              :movie-id="movie.media_file_id"
              @format-error="handleFormatError"
            />
          </div>
          <div v-if="formatError" class="mt-4 p-4 bg-yellow-900/50 border border-yellow-700 rounded-lg">
            <p class="text-yellow-200 font-semibold mb-2">Video Format Not Supported</p>
            <p class="text-yellow-300 text-sm">
              The browser's native video player does not support {{ formatError?.contentType || 'this video format' }}. 
              Only MP4, WebM, and OGG formats are supported natively.
            </p>
            <p v-if="mediaFile" class="text-yellow-300 text-sm mt-2">
              Your file is: {{ mediaFile.file_extension.toUpperCase() }} ({{ formatError?.contentType }})
            </p>
            <p class="text-yellow-300 text-sm mt-2">
              Consider transcoding the video to MP4 format for browser compatibility.
            </p>
          </div>
        </div>
        <div v-else-if="showPlayer && !movie.media_file_id" class="mt-8 p-8 bg-gray-800 rounded-lg text-center text-gray-400">
          <p>No media file associated with this movie.</p>
        </div>
      </div>
    </div>

    <div v-else class="container mx-auto px-6 py-8 text-center text-white">
      <p class="text-xl">Media not found</p>
      <router-link to="/" class="text-primary-400 hover:text-primary-300 mt-4 inline-block">
        Back to home
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MenuBar from '../components/MenuBar.vue'
import VideoPlayer from '../components/VideoPlayer.vue'
import { media } from '@/api/client'

const route = useRoute()
const router = useRouter()
const showPlayer = ref(false)
const movie = ref(null)
const mediaFile = ref(null)
const loading = ref(false)
const error = ref('')
const formatError = ref(null)

async function loadMedia() {
  loading.value = true
  error.value = ''
  
  try {
    // Load Movie first
    movie.value = await media.getMovie(route.params.id)
    
    // If Movie has a media_file_id, load the MediaFile
    if (movie.value?.media_file_id) {
      try {
        mediaFile.value = await media.getMediaFile(movie.value.media_file_id)
      } catch (err) {
        console.error('Failed to load media file:', err)
        // Don't fail the whole page if MediaFile can't be loaded
      }
    }
  } catch (err) {
    console.error('Failed to load media:', err)
    error.value = 'Failed to load media details. Please try again.'
  } finally {
    loading.value = false
  }
}

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

function formatDurationSeconds(seconds) {
  return formatDuration(seconds)
}

function formatBitrate(bitrate) {
  if (bitrate >= 1000000) {
    return `${(bitrate / 1000000).toFixed(2)} Mbps`
  }
  return `${(bitrate / 1000).toFixed(0)} Kbps`
}

function formatFileSize(bytes) {
  if (bytes >= 1073741824) {
    return `${(bytes / 1073741824).toFixed(2)} GB`
  }
  if (bytes >= 1048576) {
    return `${(bytes / 1048576).toFixed(2)} MB`
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`
  }
  return `${bytes} B`
}

function handlePlayClick() {
  formatError.value = null // Reset error when starting playback
  showPlayer.value = true
}

function handleFormatError(errorData) {
  formatError.value = errorData
}

onMounted(() => {
  loadMedia()
})
</script>
