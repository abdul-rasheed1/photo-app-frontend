"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageCircle, Send, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import type { Post, Comment } from "@/lib/types"
import { getUser } from "@/lib/auth"
import { addComment, deleteComment } from "@/lib/posts"

interface PostDetailProps {
  post: Post
  comments: Comment[]
  onCommentsUpdate: (comments: Comment[]) => void
}

export function PostDetail({ post, comments, onCommentsUpdate }: PostDetailProps) {
  const router = useRouter()
  const user = getUser()
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes)
  const [commentText, setCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!commentText.trim()) return

    setIsSubmitting(true)

    try {
      if (!user) {
        router.push("/login")
        return
      }

      const newComment = addComment(post.id, user.id, user.username, commentText)
      onCommentsUpdate([...comments, newComment])
      setCommentText("")
      toast.success("Comment added successfully!")
    } catch (error) {
      toast.error("Failed to add comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = (commentId: string) => {
    try {
      deleteComment(commentId, post.id)
      onCommentsUpdate(comments.filter((c) => c.id !== commentId))
      toast.success("Comment deleted")
    } catch (error) {
      toast.error("Failed to delete comment")
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
    <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
      {/* Caption Section */}
      <Card className="flex flex-col">
        {/* Post Header - User info appears only once */}
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-auto p-0 hover:bg-transparent">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-semibold">{post.userId}</p>
            <p className="text-xs text-muted-foreground">{formatTimeAgo(post.createdAt)}</p>
          </div>
        </div>

        <Separator />

        {/* Caption - without user name prefix */}
        {post.caption && (
          <>
            <div className="p-4">
              <p className="text-sm text-foreground">{post.caption}</p>
            </div>
            <Separator />
          </>
        )}

        {/* Image */}
        {post.imageUrl && (
          <>
            <div className="relative aspect-square w-full">
              <Image src={post.imageUrl || "/placeholder.svg"} alt={post.caption} fill className="object-cover" />
            </div>
            <Separator />
          </>
        )}

        {/* Actions */}
        <div className="p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent" onClick={handleLike}>
              <Heart className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <span className="text-sm font-semibold">{likes.toLocaleString()}</span>
            <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
              <MessageCircle className="h-6 w-6" />
            </Button>
            <span className="text-sm font-semibold">{comments.length}</span>
          </div>
        </div>

        <Separator />

        {/* Comments Section */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">{comment.username}</span>{" "}
                      <span className="text-foreground">{comment.text}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatTimeAgo(comment.createdAt)}</p>
                  </div>
                  {comment.userId === user?.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="h-auto p-0 text-xs text-destructive hover:bg-destructive/10"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <Separator />

        {/* Comment Input */}
        <form onSubmit={handleCommentSubmit} className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isSubmitting}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isSubmitting || !commentText.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
