"use client"

import { Card } from "@/components/ui/card"
import type { Comment } from "@/lib/types"
import { CommentItem } from "./comment-item"

interface CommentsListProps {
  comments: Comment[]
  postId: string
  onCommentsChange: (comments: Comment[]) => void
}

export function CommentsList({ comments, postId, onCommentsChange }: CommentsListProps) {
  if (comments.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-muted-foreground">{comments.length} Comments</p>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          onCommentDeleted={(deletedId) => {
            const updated = comments.filter((c) => c.id !== deletedId)
            onCommentsChange(updated)
          }}
        />
      ))}
    </div>
  )
}
