"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Comment } from "@/lib/types"
import { getUser } from "@/lib/auth"
import { deleteComment } from "@/lib/posts"

interface CommentItemProps {
  comment: Comment
  postId: string
  onCommentDeleted: (commentId: string) => void
}

export function CommentItem({ comment, postId, onCommentDeleted }: CommentItemProps) {
  const user = getUser()
  const isOwnComment = user?.id === comment.userId

  const handleDelete = () => {
    try {
      deleteComment(comment.id, postId)
      onCommentDeleted(comment.id)
      toast.success("Comment deleted")
    } catch (error) {
      toast.error("Failed to delete comment")
      console.error("[v0] Error deleting comment:", error)
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
    <Card className="p-4">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>{comment.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">{comment.username}</span>
              </p>
              <p className="text-sm text-foreground mt-1">{comment.text}</p>
              <p className="text-xs text-muted-foreground mt-2">{formatTimeAgo(comment.createdAt)}</p>
            </div>

            {isOwnComment && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-auto p-1 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
