"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/auth"
import { getUserPosts } from "@/lib/posts"
import { FeedHeader } from "@/components/feed/feed-header"
import { PostCard } from "@/components/feed/post-card"
import type { Post, User } from "@/lib/types"

export default function MyPostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    const userPosts = getUserPosts(currentUser.id)
    setPosts(userPosts)
    setIsLoading(false)
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      <FeedHeader />
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">My Posts</h1>
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-96 rounded-lg bg-muted" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">You haven't created any posts yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
