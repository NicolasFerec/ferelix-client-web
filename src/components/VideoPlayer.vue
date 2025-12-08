<template>
  <div class="video-player w-full">
    <video
      ref="videoElement"
      class="w-full h-auto"
      controls
      playsinline
    ></video>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Hls from 'hls.js'
import { getAccessToken } from '@/api/client'

const props = defineProps({
  movieId: {
    type: [String, Number],
    required: true
  }
})

const videoElement = ref(null)
let hls = null

// Build HLS URL with authentication token
const hlsUrl = computed(() => {
  const token = getAccessToken()
  const baseUrl = `/api/v1/stream/${props.movieId}/master.m3u8`
  return token ? `${baseUrl}?token=${token}` : baseUrl
})

function initPlayer() {
  if (!videoElement.value) return

  const video = videoElement.value

  if (Hls.isSupported()) {
    // Use HLS.js for browsers that don't support native HLS
    hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
      xhrSetup: (xhr, url) => {
        // Token is already in the URL as query parameter
        // HLS.js will use it automatically for all segment requests
      }
    })
    hls.loadSource(hlsUrl.value)
    hls.attachMedia(video)
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      // Video is ready to play
    })
    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error('HLS error:', data)
    })
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // Native HLS support (Safari)
    video.src = hlsUrl.value
  } else {
    console.error('HLS is not supported in this browser')
  }
}

onMounted(() => {
  initPlayer()
})

onUnmounted(() => {
  if (hls) {
    hls.destroy()
    hls = null
  }
})
</script>

