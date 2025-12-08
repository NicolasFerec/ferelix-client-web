/**
 * API client for Ferelix backend
 * Handles authentication, token refresh, and API requests
 */

const API_BASE = '/api/v1';
const TOKEN_KEY = 'auth_access_token';
const REFRESH_KEY = 'auth_refresh_token';

/**
 * Get access token from localStorage
 */
export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

/**
 * Save tokens to localStorage
 */
export function saveTokens(accessToken, refreshToken) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}

/**
 * Clear tokens from localStorage
 */
export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!getAccessToken();
}

let isRefreshing = false;
let refreshSubscribers = [];

/**
 * Subscribe to token refresh completion
 */
function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

/**
 * Notify all subscribers when token refresh completes
 */
function onTokenRefreshed(accessToken) {
  refreshSubscribers.forEach(callback => callback(accessToken));
  refreshSubscribers = [];
}

/**
 * Attempt to refresh the access token
 */
async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    clearTokens();
    window.location.href = '/login';
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  saveTokens(data.access_token, data.refresh_token);
  return data.access_token;
}

/**
 * Make an authenticated fetch request with automatic token refresh
 */
async function authenticatedFetch(url, options = {}) {
  const accessToken = getAccessToken();
  
  // Add authorization header if token exists
  const headers = {
    ...options.headers,
  };
  
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 with token refresh
  if (response.status === 401 && getRefreshToken()) {
    if (!isRefreshing) {
      isRefreshing = true;
      
      try {
        const newAccessToken = await refreshAccessToken();
        isRefreshing = false;
        onTokenRefreshed(newAccessToken);
        
        // Retry original request with new token
        headers['Authorization'] = `Bearer ${newAccessToken}`;
        response = await fetch(url, {
          ...options,
          headers,
        });
      } catch (error) {
        isRefreshing = false;
        throw error;
      }
    } else {
      // Wait for ongoing refresh to complete
      const newAccessToken = await new Promise(resolve => {
        subscribeTokenRefresh(resolve);
      });
      
      // Retry with new token
      headers['Authorization'] = `Bearer ${newAccessToken}`;
      response = await fetch(url, {
        ...options,
        headers,
      });
    }
  }

  // Throw error for non-2xx responses
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
    error.response = response;
    
    try {
      error.data = await response.json();
    } catch {
      error.data = null;
    }
    
    throw error;
  }

  return response;
}

/**
 * Parse JSON response or return null for 204 No Content
 */
async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

/**
 * GET request
 */
export async function get(endpoint) {
  const response = await authenticatedFetch(`${API_BASE}${endpoint}`);
  return parseResponse(response);
}

/**
 * POST request
 */
export async function post(endpoint, data) {
  const response = await authenticatedFetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return parseResponse(response);
}

/**
 * DELETE request
 */
export async function del(endpoint, data = null) {
  const options = {
    method: 'DELETE',
  };
  
  if (data) {
    options.headers = {
      'Content-Type': 'application/json',
    };
    options.body = JSON.stringify(data);
  }
  
  const response = await authenticatedFetch(`${API_BASE}${endpoint}`, options);
  return parseResponse(response);
}

/**
 * Public request (no authentication)
 */
export async function publicRequest(url, options = {}) {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
    error.response = response;
    
    try {
      error.data = await response.json();
    } catch {
      error.data = null;
    }
    
    throw error;
  }
  
  return parseResponse(response);
}

// Export authentication-related functions
export const auth = {
  /**
   * Login
   */
  async login(username, password, deviceInfo = null) {
    const data = await publicRequest(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, device_info: deviceInfo }),
    });
    
    saveTokens(data.access_token, data.refresh_token);
    return data;
  },

  /**
   * Logout
   */
  async logout() {
    const refreshToken = getRefreshToken();
    
    if (refreshToken) {
      try {
        await del('/auth/logout', { refresh_token: refreshToken });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }
    
    clearTokens();
  },

  /**
   * Check setup status
   */
  async checkSetupStatus() {
    return publicRequest(`${API_BASE}/setup/status`);
  },

  /**
   * Create admin account (first-time setup)
   */
  async createAdmin(username, email, password) {
    return publicRequest(`${API_BASE}/setup/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
  },
};

// Export media-related functions
export const media = {
  /**
   * Get all movies
   */
  async getMovies(skip = 0, limit = 100) {
    return get(`/media/movies?skip=${skip}&limit=${limit}`);
  },

  /**
   * Get movie by ID
   */
  async getMovie(id) {
    return get(`/media/movies/${id}`);
  },
};
