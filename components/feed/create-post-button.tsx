"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function CreatePostButton() {
  return (
    <div className="fixed bottom-8 right-8">
      <Button asChild size="lg" className="h-14 w-14 rounded-full shadow-lg">
        <Link href="/create">
          <Plus className="h-6 w-6" />
          <span className="sr-only">Create post</span>
        </Link>
      </Button>
    </div>
  )
}
