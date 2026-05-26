import axios from 'axios'

// Dev: call `/api/*` and let Vite proxy handle it.
// Production: set `VITE_API_URL` to your deployed Express base (ex: https://.../api).
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

/** Shared Axios instance for all backend API calls. */
export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

/**
 * Success: return response body (JSON) directly.
 * Error: convert to a simple Error with a readable message.
 */
httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Failed to connect to the server'

    return Promise.reject(new Error(message))
  },
)
