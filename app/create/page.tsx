"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/auth"
import { FeedHeader } from "@/components/feed/feed-header"
import { CreatePostForm } from "@/components/create/create-post-form"

export default function CreatePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = getUser()
    if (!user) {
      router.push("/login")
      return
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <FeedHeader />
        <main className="container mx-auto max-w-2xl px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 rounded-lg bg-muted" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <FeedHeader />
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Create New Post</h1>
        <CreatePostForm />
      </main>
    </div>
  )
}
