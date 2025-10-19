"use client"

import type React from "react"
import { useState } from "react"
import { toast } from "sonner"
import type { Comment } from "@/lib/types"
import { getUser } from "@/lib/auth"
import { addComment } from "@/lib/posts"
import { CommentsList } from "./comment-list"
import { CommentForm } from "./comment-form"

interface CommentsContainerProps {
  postId: string
  initialComments: Comment[]
  onCommentsChange: (comments: Comment[]) => void
}

export function CommentsContainer({ postId, initialComments, onCommentsChange }: CommentsContainerProps) {
  const user = getUser()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [commentText, setCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!commentText.trim()) return

    if (!user) {
      toast.error("Please log in to comment")
      return
    }

    setIsSubmitting(true)

    try {
      const newComment = addComment(postId, user.id, user.username, commentText)
      const updatedComments = [...comments, newComment]
      setComments(updatedComments)
      onCommentsChange(updatedComments)
      setCommentText("")
      toast.success("Comment added!")
    } catch (error) {
      toast.error("Failed to add comment")
      console.error("[v0] Error adding comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Comments List */}
      <CommentsList comments={comments} postId={postId} onCommentsChange={onCommentsChange} />

      {/* Comment Form */}
      <CommentForm
        commentText={commentText}
        onCommentTextChange={setCommentText}
        onSubmit={handleAddComment}
        isSubmitting={isSubmitting}
        isLoggedIn={!!user}
      />
    </div>
  )
}
