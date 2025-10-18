"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/auth"
import { getAllPosts } from "@/lib/posts"
import { FeedHeader } from "@/components/feed/feed-header"
import { PostCard } from "@/components/feed/post-card"
import { CreatePostButton } from "@/components/feed/create-post-button"
import type { Post } from "@/lib/types"

export default function FeedPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = getUser()
    if (!user) {
      router.push("/login")
      return
    }

    setTimeout(() => {
      setPosts(getAllPosts())
      setIsLoading(false)
    }, 500)
  }, [router])

  useEffect(() => {
    const handleStorageChange = () => {
      setPosts(getAllPosts())
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <FeedHeader />
        <main className="container mx-auto max-w-2xl px-4 py-8">
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-96 rounded-lg bg-muted" />
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <FeedHeader />
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <div className="space-y-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
      <CreatePostButton />
    </div>
  )
}
