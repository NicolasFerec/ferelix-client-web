<template>
  <tr class="hover:bg-gray-700">
    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
      {{ library.name }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
      {{ library.path }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
      {{ getLibraryTypeLabel(library.library_type) }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm">
      <span
        :class="[
          'px-2 py-1 rounded-full text-xs font-medium',
          library.enabled
            ? 'bg-green-900 text-green-300'
            : 'bg-gray-700 text-gray-400'
        ]"
      >
        {{ library.enabled ? $t('common.enabled') : $t('common.disabled') }}
      </span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
      <div ref="dropdownRef" class="relative inline-block text-left">
        <button
          @click="showDropdown = !showDropdown"
          class="inline-flex justify-center w-full rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
        >
          {{ $t('common.actions') }}
          <svg
            class="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <div
          v-if="showDropdown"
          class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-2xl bg-gray-600 border border-gray-500 focus:outline-none z-50"
        >
          <div class="py-1">
            <button
              @click="handleScan"
              :disabled="scanning"
              class="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ $t('libraries.actions.scan') }}
            </button>
            <button
              @click="handleEdit"
              class="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-500"
            >
              {{ $t('libraries.actions.edit') }}
            </button>
            <button
              @click="handleDelete"
              class="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-500"
            >
              {{ $t('libraries.actions.delete') }}
            </button>
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { libraries as libraryApi } from '@/api/client'

const props = defineProps({
  library: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'scan'])

const { t } = useI18n()

const showDropdown = ref(false)
const scanning = ref(false)
const dropdownRef = ref(null)

function getLibraryTypeLabel(type) {
  if (type === 'movie') {
    return t('libraries.type.movie')
  } else if (type === 'tv_show') {
    return t('libraries.type.tv_show')
  }
  return type
}

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

async function handleScan() {
  showDropdown.value = false
  scanning.value = true
  
  try {
    await libraryApi.scanLibrary(props.library.id)
    emit('scan', props.library)
  } catch (err) {
    console.error('Failed to scan library:', err)
    alert(err.data?.detail || t('libraries.scanFailed'))
  } finally {
    scanning.value = false
  }
}

function handleEdit() {
  showDropdown.value = false
  emit('edit', props.library)
}

function handleDelete() {
  showDropdown.value = false
  emit('delete', props.library)
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
