"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ImagePlus, X, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { createPost } from "@/lib/posts"
import { getUser } from "@/lib/auth"

export function CreatePostForm() {
  const router = useRouter()
  const [caption, setCaption] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!caption.trim() && !imagePreview) {
      toast.error("Please add a caption or upload an image")
      return
    }

    setIsSubmitting(true)

    try {
      const user = getUser()
      if (!user) {
        router.push("/login")
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 500))

      createPost({
        userId: user.id,
        caption: caption.trim(),
        imageUrl: imagePreview || "",
        likes: 0,
        comments: 0,
      })

      toast.success("Post created successfully!")
      router.push("/feed")
    } catch (error) {
      toast.error("Failed to create post")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="overflow-hidden">
        <div className="relative">
          {imagePreview ? (
            <div className="relative aspect-square w-full">
              <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-4 top-4"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-border bg-muted/50 transition-colors hover:bg-muted"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">Click to upload an image (optional)</p>
              <p className="mt-1 text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
        </div>

        <div className="p-4">
          <Label htmlFor="caption">Caption</Label>
          <Textarea
            id="caption"
            placeholder="Write something..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="mt-2 min-h-[100px] resize-none"
            maxLength={500}
          />
          <p className="mt-2 text-xs text-muted-foreground">{caption.length}/500 characters</p>
        </div>
      </Card>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1 bg-transparent"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Post"}
        </Button>
      </div>
    </form>
  )
}
