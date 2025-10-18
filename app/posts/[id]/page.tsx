"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getPostById, getPostComments } from "@/lib/posts"
import type { Post, Comment } from "@/lib/types"
import { CommentsContainer } from "@/components/comments/comments-container"

export default function CommentsPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate async operation for consistency
        await new Promise((resolve) => setTimeout(resolve, 100))

        const fetchedPost = getPostById(postId)
        if (!fetchedPost) {
          setError("Post not found")
          setIsLoading(false)
          return
        }

        const fetchedComments = getPostComments(postId)
        setPost(fetchedPost)
        setComments(fetchedComments)
      } catch (err) {
        setError("Failed to load comments")
        console.error("[v0] Error loading comments:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [postId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading comments...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-destructive">{error || "Post not found"}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl p-4">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-auto p-0 hover:bg-transparent">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Comments</h1>
        </div>

        {/* Post Preview Card */}
        <Card className="mb-6 p-4">
          <p className="text-sm text-muted-foreground mb-2">On post by {post.userId}</p>
          <p className="text-sm text-foreground">{post.caption}</p>
        </Card>

        {/* Comments Container */}
        <CommentsContainer postId={postId} initialComments={comments} onCommentsChange={setComments} />
      </div>
    </div>
  )
}
