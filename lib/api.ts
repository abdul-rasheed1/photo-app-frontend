import { getAuthToken, setAuthToken, getRefreshToken, setRefreshToken, removeAuthToken } from "./auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Track if we're currently refreshing to prevent multiple refresh calls
let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        removeAuthToken()
        window.location.href = "/login"
        return null
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        removeAuthToken()
        window.location.href = "/login"
        return null
      }

      const data = await response.json()
      setAuthToken(data.accessToken)
      if (data.refreshToken) {
        setRefreshToken(data.refreshToken)
      }

      return data.accessToken
    } catch (error) {
      console.error("[v0] Token refresh failed:", error)
      removeAuthToken()
      window.location.href = "/login"
      return null
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getAuthToken()

  let response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  })

  if (response.status === 401 && token) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`,
          ...options?.headers,
        },
      })
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `API Error: ${response.statusText}`)
  }

  return response.json()
}
