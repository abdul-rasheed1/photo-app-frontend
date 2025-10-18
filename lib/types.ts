// Core type definitions for the app
export interface User {
  id: string
  username: string
  email: string
  createdAt: string
}

export interface Post {
  id: string
  userId: string
  caption: string
  imageUrl?: string
  likes: number
  comments: number
  createdAt: string
}

export interface Comment {
  id: string
  postId: string
  userId: string
  text: string
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}
