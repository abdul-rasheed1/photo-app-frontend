"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getPostById, getPostComments } from "@/lib/posts"
import { FeedHeader } from "@/components/feed/feed-header"
import { PostDetail } from "@/components/post/post-detail"
import type { Post, Comment } from "@/lib/types"

export default function PostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  useEffect(() => {
    if (!hasHydrated) return

    const timer = setTimeout(() => {
      try {
        console.log("[v0] Fetching post with ID:", postId)
        const foundPost = getPostById(postId)

        if (foundPost) {
          console.log("[v0] Post found:", foundPost)
          const postComments = getPostComments(postId)
          setPost(foundPost)
          setComments(postComments)
          setError(null)
        } else {
          console.log(
            "[v0] Post not found. Available posts:",
            JSON.parse(localStorage.getItem("photoshare_posts") || "[]"),
          )
          setError(`Post with ID ${postId} not found. Please go back and try again.`)
          setPost(null)
        }
      } catch (err) {
        console.error("[v0] Error loading post:", err)
        setError("Error loading post. Please try again.")
        setPost(null)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [postId, hasHydrated])

  if (!hasHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <FeedHeader />
        <main className="container mx-auto max-w-4xl px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 rounded-lg bg-muted" />
          </div>
        </main>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <FeedHeader />
        <main className="container mx-auto max-w-4xl px-4 py-8">
          <div className="text-center">
            <p className="mb-4 text-muted-foreground">{error || "Post not found"}</p>
            <button
              onClick={() => router.back()}
              className="inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Go back
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <FeedHeader />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <PostDetail post={post} comments={comments} onCommentsUpdate={setComments} />
      </main>
    </div>
  )
}
