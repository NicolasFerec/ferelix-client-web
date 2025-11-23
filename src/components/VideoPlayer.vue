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
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Hls from 'hls.js'

const props = defineProps({
  hlsUrl: {
    type: String,
    required: true
  }
})

const videoElement = ref(null)
let hls = null

function initPlayer() {
  if (!videoElement.value) return

  const video = videoElement.value

  if (Hls.isSupported()) {
    // Use HLS.js for browsers that don't support native HLS
    hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false
    })
    hls.loadSource(props.hlsUrl)
    hls.attachMedia(video)
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      // Video is ready to play
    })
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // Native HLS support (Safari)
    video.src = props.hlsUrl
  } else {
    console.error('HLS is not supported in this browser')
  }
}

watch(() => props.hlsUrl, () => {
  if (hls) {
    hls.destroy()
    hls = null
  }
  initPlayer()
})

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

