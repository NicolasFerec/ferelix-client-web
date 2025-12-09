<template>
  <div class="jobs-panel">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-white">{{ $t('jobs.title') }}</h2>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center text-gray-400 py-12">
      {{ $t('common.loading') }}
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center text-red-400 py-12">
      <p>{{ error }}</p>
      <button
        @click="loadJobs"
        class="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
      >
        {{ $t('common.retry') }}
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="jobs.length === 0" class="text-center text-gray-400 py-12">
      <p>{{ $t('jobs.noJobs') }}</p>
    </div>

    <!-- Jobs table -->
    <div v-else class="bg-gray-800 rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-700">
        <thead class="bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              {{ $t('jobs.name') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              {{ $t('jobs.lastRun') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              {{ $t('jobs.nextRun') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              {{ $t('jobs.statusLabel') }}
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
              {{ $t('jobs.actions') }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-gray-800 divide-y divide-gray-700">
          <tr v-for="job in jobs" :key="job.id" class="hover:bg-gray-750">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
              {{ getJobName(job) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {{ formatDate(job.last_run_time) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {{ formatDate(job.next_run_time) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  getStatusClass(job.status)
                ]"
              >
                {{ getStatusLabel(job.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="triggerJob(job.id)"
                :disabled="triggeringJobs.has(job.id)"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors text-sm"
              >
                {{ triggeringJobs.has(job.id) ? $t('jobs.triggering') : $t('jobs.trigger') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Success notification -->
    <div
      v-if="showSuccess"
      class="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-md shadow-lg z-50"
    >
      {{ successMessage }}
    </div>

    <!-- Error notification -->
    <div
      v-if="showError"
      class="fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-md shadow-lg z-50"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { jobs as jobsApi, getAccessToken } from '@/api/client'

const { t, locale } = useI18n()

const jobs = ref([])
const loading = ref(false)
const error = ref('')
const triggeringJobs = ref(new Set())
const showSuccess = ref(false)
const showError = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const liveConnected = ref(false)
const websocketRef = ref(null)
let reconnectTimer = null

// Date formatter using browser's Intl API
function formatDate(dateString) {
  if (!dateString) {
    return t('jobs.neverRun')
  }

  try {
    const date = new Date(dateString)
    // Use browser's locale for date/time formatting
    const formatter = new Intl.DateTimeFormat(locale.value, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    return formatter.format(date)
  } catch (err) {
    console.error('Failed to format date:', err)
    return dateString
  }
}

function getJobName(job) {
  if (job?.name_key) {
    const translated = t(job.name_key)
    if (translated && translated !== job.name_key) {
      return translated
    }
  }
  return job?.name || job?.id || ''
}

function getStatusLabel(status) {
  switch (status) {
    case 'running':
      return t('jobs.status.running')
    case 'success':
      return t('jobs.status.success')
    case 'failed':
      return t('jobs.status.failed')
    case 'pending':
    default:
      return t('jobs.status.pending')
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'running':
      return 'bg-blue-100 text-blue-800'
    case 'success':
      return 'bg-green-100 text-green-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    case 'pending':
    default:
      return 'bg-yellow-100 text-yellow-800'
  }
}

function upsertJob(jobUpdate) {
  const existingIndex = jobs.value.findIndex(job => job.id === jobUpdate.id)
  if (existingIndex !== -1) {
    jobs.value[existingIndex] = { ...jobs.value[existingIndex], ...jobUpdate }
  } else {
    jobs.value = [...jobs.value, jobUpdate]
  }
}

function addTriggering(jobId) {
  const next = new Set(triggeringJobs.value)
  next.add(jobId)
  triggeringJobs.value = next
}

function removeTriggering(jobId) {
  const next = new Set(triggeringJobs.value)
  next.delete(jobId)
  triggeringJobs.value = next
}

async function loadJobs() {
  loading.value = true
  error.value = ''
  try {
    jobs.value = await jobsApi.getJobs()
  } catch (err) {
    console.error('Failed to load jobs:', err)
    error.value = err.data?.detail || t('jobs.loadFailed')
  } finally {
    loading.value = false
  }
}

function disconnectWebSocket() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  if (websocketRef.value) {
    websocketRef.value.close()
    websocketRef.value = null
  }
  liveConnected.value = false
}

function scheduleReconnect() {
  if (reconnectTimer) {
    return
  }
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    connectWebSocket()
  }, 3000)
}

function connectWebSocket() {
  const token = getAccessToken()
  if (!token) {
    return
  }

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  const socketUrl = `${protocol}://${window.location.host}/api/v1/jobs/ws?api_key=${encodeURIComponent(token)}`
  const socket = new WebSocket(socketUrl)
  websocketRef.value = socket

  socket.onopen = () => {
    liveConnected.value = true
  }

  socket.onclose = () => {
    liveConnected.value = false
    scheduleReconnect()
  }

  socket.onerror = () => {
    liveConnected.value = false
    socket.close()
  }

  socket.onmessage = event => {
    try {
      const payload = JSON.parse(event.data)
      if (payload.type === 'snapshot' && Array.isArray(payload.jobs)) {
        jobs.value = payload.jobs
      } else if (payload.type === 'job_update' && payload.job) {
        upsertJob(payload.job)
      }
    } catch (err) {
      console.error('Failed to parse job update message:', err)
    }
  }
}

async function triggerJob(jobId) {
  addTriggering(jobId)
  showSuccess.value = false
  showError.value = false

  try {
    await jobsApi.triggerJob(jobId)
    // Optimistically mark as running while the job executes
    upsertJob({
      id: jobId,
      status: 'running',
      running_since: new Date().toISOString(),
      error: null,
    })
    successMessage.value = t('jobs.triggerSuccess')
    showSuccess.value = true

    // Hide success message after 3 seconds
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  } catch (err) {
    console.error('Failed to trigger job:', err)
    errorMessage.value = err.data?.detail || t('jobs.triggerFailed')
    showError.value = true

    // Hide error message after 5 seconds
    setTimeout(() => {
      showError.value = false
    }, 5000)
  } finally {
    removeTriggering(jobId)
  }
}

onMounted(() => {
  loadJobs()
  connectWebSocket()
})

onBeforeUnmount(() => {
  disconnectWebSocket()
})
</script>



