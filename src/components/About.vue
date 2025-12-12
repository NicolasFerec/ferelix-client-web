<template>
  <div class="about-panel">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-white">{{ $t('about.title') }}</h2>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center text-gray-400 py-12">
      {{ $t('common.loading') }}
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center text-red-400 py-12">
      <p>{{ error }}</p>
      <button
        @click="loadVersionInfo"
        class="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
      >
        {{ $t('common.retry') }}
      </button>
    </div>

    <!-- Version info -->
    <div v-else class="space-y-6">
      <!-- Backend version -->
      <div class="bg-gray-800 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-white mb-4">{{ $t('about.backend') }}</h3>
        <div class="space-y-2">
          <div class="flex items-center">
            <span class="text-sm font-medium text-gray-400 w-24">{{ $t('about.commit') }}:</span>
            <span class="text-sm text-gray-300 font-mono">{{ backendVersion.commit }}</span>
          </div>
          <div class="flex items-center">
            <span class="text-sm font-medium text-gray-400 w-24">{{ $t('about.branch') }}:</span>
            <span class="text-sm text-gray-300">{{ backendVersion.branch }}</span>
          </div>
        </div>
      </div>

      <!-- Frontend version -->
      <div class="bg-gray-800 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-white mb-4">{{ $t('about.frontend') }}</h3>
        <div class="space-y-2">
          <div class="flex items-center">
            <span class="text-sm font-medium text-gray-400 w-24">{{ $t('about.commit') }}:</span>
            <span class="text-sm text-gray-300 font-mono">{{ frontendVersion.commit }}</span>
          </div>
          <div class="flex items-center">
            <span class="text-sm font-medium text-gray-400 w-24">{{ $t('about.branch') }}:</span>
            <span class="text-sm text-gray-300">{{ frontendVersion.branch }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { dashboard } from '@/api/client';
import { getVersionInfo } from '@/utils/version';

const loading = ref(true);
const error = ref(null);
const backendVersion = ref({ commit: 'unknown', branch: 'unknown' });
const frontendVersion = ref({ commit: 'unknown', branch: 'unknown' });

async function loadVersionInfo() {
  loading.value = true;
  error.value = null;

  try {
    // Get frontend version (from version utility)
    frontendVersion.value = getVersionInfo();

    // Get backend version (from API)
    backendVersion.value = await dashboard.getVersionInfo();
  } catch (err) {
    error.value = err.message || err.data?.detail || 'Failed to load version information';
    console.error('Failed to load version info:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadVersionInfo();
});
</script>



