# Agent Technical Documentation

This file contains technical details and conventions for AI agents working on this project.

## Package Manager

**This project uses pnpm as the package manager**.

### Common Commands

```bash
# Install dependencies
pnpm install

# Add a new dependency
pnpm add package-name

# Add a dev dependency
pnpm add -D package-name

# Remove a dependency
pnpm remove package-name

# Update dependencies
pnpm update
```

## Running the Application

```bash
# Development mode (with hot reload)
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Clean build artifacts
pnpm clean
```

The dev server runs on `http://localhost:5173` by default and proxies API requests to `http://localhost:8000`.

## Project Structure Conventions

- **Components**: Reusable Vue components in `src/components/`
- **Views**: Page-level components in `src/views/`
- **Router**: Vue Router configuration in `src/router/`
- **API Client**: Centralized API communication in `src/api/client.js`
- **Composables**: Shared composition API logic in `src/composables/`
- **i18n**: Internationalization in `src/i18n/` with locale files in `src/i18n/locales/`

## API Client Usage

The API client (`src/api/client.js`) handles authentication, token refresh, and all API requests.

**Import and use:**

```javascript
import { auth, media, libraries, jobs } from '@/api/client';

// Authentication
await auth.login(username, password);
await auth.logout();
const user = await auth.getCurrentUser();

// Libraries
const libs = await libraries.getLibraries();
const items = await libraries.getLibraryItems(libraryId);

// Media
const mediaFile = await media.getMediaFile(id);

// Jobs (admin)
const jobList = await jobs.getJobs();
await jobs.triggerJob(jobId);
```

**Key features:**
- Automatic token refresh on 401 responses
- Tokens stored in localStorage
- All requests automatically include authentication headers
- Handles concurrent requests during token refresh

## Internationalization (i18n)

The app uses `vue-i18n` for translations.

**Add translations:**
1. Add keys to `src/i18n/locales/en.json` (English)
2. Add corresponding translations to `src/i18n/locales/fr.json` (French)

**Use in templates:**

```vue
<template>
  <h1>{{ $t('welcome.title') }}</h1>
  <p>{{ $t('welcome.description', { name: userName }) }}</p>
</template>
```

**Use in composition API:**

```javascript
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const message = t('welcome.title');
```

## Styling

The project uses **Tailwind CSS** for styling.

- Configuration in `tailwind.config.js`
- Global styles in `src/style.css`
- Use utility classes directly in components
- Custom colors and theme extensions are defined in the Tailwind config

**Example:**

```vue
<template>
  <div class="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
    <h2 class="text-xl font-bold text-gray-900">Title</h2>
  </div>
</template>
```

## Key Dependencies

- **vue**: Frontend framework (Composition API)
- **vue-router**: Client-side routing
- **vue-i18n**: Internationalization
- **hls.js**: HLS video streaming support
- **vite**: Build tool and dev server
- **tailwindcss**: Utility-first CSS framework

## Development Proxy

The Vite dev server proxies `/api` requests to the backend server (configured in `vite.config.js`):

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- All `/api/*` requests are automatically proxied

This eliminates CORS issues during development.

## Path Aliases

The `@` alias resolves to `src/`:

```javascript
// Instead of: import Component from '../../components/Component.vue'
import Component from '@/components/Component.vue';
```

## Code Style Conventions

- Use Vue 3 Composition API with `<script setup>`
- Use single-file components (`.vue`)
- Name components using PascalCase (e.g., `MediaCard.vue`)
- Use camelCase for variables and functions
- Use async/await for API calls
- Handle errors with try-catch blocks
- Always provide user feedback for loading states and errors

**Example component structure:**

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { libraries } from '@/api/client';

const items = ref([]);
const loading = ref(false);
const error = ref(null);

onMounted(async () => {
  loading.value = true;
  try {
    items.value = await libraries.getLibraries();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <div v-else>
    <!-- Content here -->
  </div>
</template>
```

## Build Configuration

- Build output: `dist/`
- Assets directory: `dist/assets/`
- Source maps are disabled in production (configure in `vite.config.js`)
- Tree-shaking and minification are automatic via Vite

## Video Streaming

The app uses `hls.js` for HLS video streaming. Video playback is handled in the `VideoPlayer.vue` component.

**Key points:**
- Supports both native HLS (Safari) and hls.js (other browsers)
- Handles adaptive bitrate streaming
- Provides playback controls and progress tracking
