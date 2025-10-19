"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/auth"
import { getUserPosts, deletePost } from "@/lib/posts"
import { FeedHeader } from "@/components/feed/feed-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import type { Post, User } from "@/lib/types"

export default function MyPostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

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

  const handleDeletePost = (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      setDeletingId(postId)
      try {
        deletePost(postId)
        setPosts(posts.filter((post) => post.id !== postId))
        toast.success("Post deleted successfully")
      } catch (error) {
        toast.error("Failed to delete post")
        console.error("[v0] Delete post error:", error)
      } finally {
        setDeletingId(null)
      }
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return "just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

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
              <Card key={post.id} className="overflow-hidden">
                {/* Post Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">user_{post.userId.slice(-3)}</p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(post.createdAt)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                    disabled={deletingId === post.id}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>

                {/* Caption */}
                {post.caption && (
                  <div className="px-4 py-2">
                    <p className="text-sm text-foreground">{post.caption}</p>
                  </div>
                )}

                {/* Image - Now handles Cloudinary URLs properly */}
                {post.imageUrl && (
                  <Link href={`/post/${post.id}`}>
                    <div className="relative aspect-square w-full cursor-pointer">
                      <Image
                        src={post.imageUrl || "/placeholder.svg"}
                        alt={post.caption || "Post image"}
                        fill
                        className="object-cover"
                        priority={false}
                      />
                    </div>
                  </Link>
                )}

                {/* Post Actions */}
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
                      <Heart className="h-6 w-6" />
                    </Button>
                    <span className="text-sm font-semibold">{post.likes.toLocaleString()}</span>
                    <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent" asChild>
                      <Link href={`/post/${post.id}/comments`}>
                        <MessageCircle className="h-6 w-6" />
                      </Link>
                    </Button>
                    <span className="text-sm font-semibold">{post.comments}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
