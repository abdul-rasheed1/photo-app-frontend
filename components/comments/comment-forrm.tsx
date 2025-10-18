"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface CommentFormProps {
  commentText: string
  onCommentTextChange: (text: string) => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
  isLoggedIn: boolean
}

export function CommentForm({
  commentText,
  onCommentTextChange,
  onSubmit,
  isSubmitting,
  isLoggedIn,
}: CommentFormProps) {
  return (
    <Card className="p-4 sticky bottom-0">
      <form onSubmit={onSubmit} className="flex gap-2">
        <Input
          placeholder={isLoggedIn ? "Add a comment..." : "Log in to comment"}
          value={commentText}
          onChange={(e) => onCommentTextChange(e.target.value)}
          disabled={isSubmitting || !isLoggedIn}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={isSubmitting || !commentText.trim() || !isLoggedIn}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  )
}
