"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Camera, LogOut, Moon, Sun, Home, ArrowLeft } from "lucide-react"
import { getUser, logout } from "@/lib/auth"
import { useTheme } from "@/components/theme-provider"
import type { User as UserType } from "@/lib/types"

export function FeedHeader() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<UserType | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setUser(getUser())
    setIsHydrated(true)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!isHydrated) {
    return (
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-auto p-0 hover:bg-transparent">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link href="/feed" className="flex items-center gap-2">
              <Camera className="h-6 w-6" />
              <span className="text-xl font-bold">PhotoShare</span>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-auto p-0 hover:bg-transparent">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Link href="/feed" className="flex items-center gap-2">
            <Camera className="h-6 w-6" />
            <span className="text-xl font-bold">PhotoShare</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt={user?.username} />
                  <AvatarFallback>{user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.username}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/feed")} className="cursor-pointer">
                <Home className="mr-2 h-4 w-4" />
                Home
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/my-posts")} className="cursor-pointer">
                <Avatar className="mr-2 h-4 w-4" />
                My Posts
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                {theme === "dark" ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark Mode
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
