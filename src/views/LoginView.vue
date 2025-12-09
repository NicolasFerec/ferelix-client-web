<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center px-4">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          {{ $t('login.title') }}
        </h2>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div v-if="error" class="rounded-md bg-red-900 bg-opacity-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-300">
                {{ error }}
              </h3>
            </div>
          </div>
        </div>

        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Username</label>
            <input
              id="username"
              v-model="username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              :placeholder="$t('login.username')"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              :placeholder="$t('login.password')"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? $t('login.signingIn') : $t('login.signIn') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { auth } from '@/api/client';
import { useUser } from '@/composables/useUser';

const { t, locale } = useI18n();
const { updateUser } = useUser();

const router = useRouter();

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

// Check setup status on mount
onMounted(async () => {
  try {
    const status = await auth.checkSetupStatus();
    if (!status.setup_complete) {
      router.push('/setup');
    }
  } catch (err) {
    console.error('Failed to check setup status:', err);
  }
});

async function handleLogin() {
  error.value = '';
  loading.value = true;

  try {
    const response = await auth.login(username.value, password.value, navigator.userAgent);

    // Load user information and set locale
    const user = await auth.getCurrentUser();
    updateUser(user);
    if (user && user.language) {
      locale.value = user.language;
    }

    router.push('/');
  } catch (err) {
    console.error('Login failed:', err);
    error.value = err.data?.detail || t('login.failed');
  } finally {
    loading.value = false;
  }
}
</script>
