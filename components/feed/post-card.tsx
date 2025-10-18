"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle } from "lucide-react"
import type { Post } from "@/lib/types"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
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
    <Card className="overflow-hidden">
      {/* Post Header - User info appears only once */}
      <div className="flex items-center gap-3 p-4">
        <Avatar>
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-semibold">user_{post.userId.slice(-3)}</p>
          <p className="text-xs text-muted-foreground">{formatTimeAgo(post.createdAt)}</p>
        </div>
      </div>

      {/* Caption - without user name prefix */}
      {post.caption && (
        <div className="px-4 py-2">
          <p className="text-sm text-foreground">{post.caption}</p>
        </div>
      )}

      {/* Image */}
      {post.imageUrl && (
        <Link href={`/post/${post.id}`}>
          <div className="relative aspect-square w-full cursor-pointer">
            <Image src={post.imageUrl || "/placeholder.svg"} alt={post.caption} fill className="object-cover" />
          </div>
        </Link>
      )}

      {/* Post Actions and Interactions */}
      <div className="p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent" onClick={handleLike}>
            <Heart className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <span className="text-sm font-semibold">{likes.toLocaleString()}</span>
          <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent" asChild>
            <Link href={`/post/${post.id}`}>
              <MessageCircle className="h-6 w-6" />
            </Link>
          </Button>
          <span className="text-sm font-semibold">{post.comments}</span>
        </div>
      </div>
    </Card>
  )
}
