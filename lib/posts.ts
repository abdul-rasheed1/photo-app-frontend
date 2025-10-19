import type { Post, Comment } from "./types"

const POSTS_KEY = "photoshare_posts"
const COMMENTS_KEY = "photoshare_comments"

// Initialize with mock posts if localStorage is empty
const initialPosts: Post[] = [
  {
    id: "1",
    userId: "user_456",
    caption: "Beautiful sunset at the beach 🌅",
    imageUrl: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=500&h=500&fit=crop",
    likes: 234,
    comments: 12,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    userId: "user_789",
    caption: "Morning coffee and good vibes ☕",
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=500&h=500&fit=crop",
    likes: 156,
    comments: 8,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    userId: "user_101",
    caption: "Exploring the city streets",
    imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=500&fit=crop",
    likes: 412,
    comments: 23,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    userId: "user_202",
    caption: "Nature's beauty never fails to amaze 🌿",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop",
    likes: 567,
    comments: 34,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
]

export function getAllPosts(): Post[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(POSTS_KEY)
  if (!stored) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(initialPosts))
    return initialPosts
  }
  return JSON.parse(stored)
}

export function getUserPosts(userId: string): Post[] {
  const allPosts = getAllPosts()
  return allPosts.filter((post) => post.userId === userId)
}

export function createPost(post: Omit<Post, "id" | "createdAt">): Post {
  const allPosts = getAllPosts()
  const newPost: Post = {
    ...post,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }

  const updatedPosts = [newPost, ...allPosts]
  localStorage.setItem(POSTS_KEY, JSON.stringify(updatedPosts))

  return newPost
}

export function getPostById(id: string): Post | undefined {
  const allPosts = getAllPosts()
  return allPosts.find((post) => post.id === id)
}

export function deletePost(postId: string): void {
  if (typeof window === "undefined") return

  const allPosts = getAllPosts()
  const filteredPosts = allPosts.filter((post) => post.id !== postId)
  localStorage.setItem(POSTS_KEY, JSON.stringify(filteredPosts))

  // Also delete associated comments
  const stored = localStorage.getItem(COMMENTS_KEY)
  if (stored) {
    const allComments: Comment[] = JSON.parse(stored)
    const filteredComments = allComments.filter((comment) => comment.postId !== postId)
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(filteredComments))
  }
}

export function getPostComments(postId: string): Comment[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(COMMENTS_KEY)
  if (!stored) return []

  const allComments = JSON.parse(stored) as Comment[]
  return allComments.filter((comment) => comment.postId === postId)
}

export function addComment(postId: string, userId: string, username: string, text: string): Comment {
  if (typeof window === "undefined") return {} as Comment

  const stored = localStorage.getItem(COMMENTS_KEY)
  const allComments: Comment[] = stored ? JSON.parse(stored) : []

  const newComment: Comment = {
    id: `c${Date.now()}`,
    postId,
    userId,
    username,
    text,
    createdAt: new Date().toISOString(),
  }

  allComments.push(newComment)
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments))

  // Update post comment count
  const allPosts = getAllPosts()
  const updatedPosts = allPosts.map((post) => (post.id === postId ? { ...post, comments: post.comments + 1 } : post))
  localStorage.setItem(POSTS_KEY, JSON.stringify(updatedPosts))

  return newComment
}

export function deleteComment(commentId: string, postId: string): void {
  if (typeof window === "undefined") return

  const stored = localStorage.getItem(COMMENTS_KEY)
  if (!stored) return

  const allComments: Comment[] = JSON.parse(stored)
  const filteredComments = allComments.filter((comment) => comment.id !== commentId)
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(filteredComments))

  // Update post comment count
  const allPosts = getAllPosts()
  const updatedPosts = allPosts.map((post) =>
    post.id === postId ? { ...post, comments: Math.max(0, post.comments - 1) } : post,
  )
  localStorage.setItem(POSTS_KEY, JSON.stringify(updatedPosts))
}
