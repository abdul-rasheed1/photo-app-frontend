"use client"

import type { User, AuthResponse } from "./types"

// Auth state management
export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
  }
}

export function setUser(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user))
  }
}

export function getUser(): User | null {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  }
  return null
}

// Placeholder auth functions - replace with real API calls
export async function login(email: string, password: string): Promise<AuthResponse> {
  // TODO: Replace with actual API call
  // const response = await apiRequest<AuthResponse>("/auth/login", {
  //   method: "POST",
  //   body: JSON.stringify({ email, password }),
  // })

  // Placeholder response
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const mockResponse: AuthResponse = {
    token: "mock_jwt_token_" + Date.now(),
    user: {
      id: "user_123",
      username: email.split("@")[0],
      email,
      createdAt: new Date().toISOString(),
    },
  }

  setAuthToken(mockResponse.token)
  setUser(mockResponse.user)

  return mockResponse
}

export async function register(username: string, email: string, password: string): Promise<AuthResponse> {
  // TODO: Replace with actual API call
  // const response = await apiRequest<AuthResponse>("/auth/register", {
  //   method: "POST",
  //   body: JSON.stringify({ username, email, password }),
  // })

  // Placeholder response
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const mockResponse: AuthResponse = {
    token: "mock_jwt_token_" + Date.now(),
    user: {
      id: "user_" + Date.now(),
      username,
      email,
      createdAt: new Date().toISOString(),
    },
  }

  setAuthToken(mockResponse.token)
  setUser(mockResponse.user)

  return mockResponse
}

export function logout() {
  removeAuthToken()
}
