<template>
  <tr class="hover:bg-gray-700">
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
    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button
        @click="$emit('edit', library)"
        class="text-indigo-400 hover:text-indigo-300 mr-4"
      >
        {{ $t('common.edit') }}
      </button>
      <button
        @click="$emit('delete', library)"
        class="text-red-400 hover:text-red-300"
      >
        {{ $t('common.delete') }}
      </button>
    </td>
  </tr>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

defineProps({
  library: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])

const { t } = useI18n()

function getLibraryTypeLabel(type) {
  if (type === 'movie') {
    return t('libraries.type.movie')
  } else if (type === 'tv_show') {
    return t('libraries.type.tv_show')
  }
  return type
}
</script>
