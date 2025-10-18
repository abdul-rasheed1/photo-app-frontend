import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, Heart, Share2, Users } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Share Your Moments with the World
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              Capture, share, and discover beautiful photos from photographers around the globe. Join our community
              today.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Everything You Need to Share
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Powerful features designed for photographers and photo enthusiasts
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Camera className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-card-foreground">Upload & Organize</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                Easily upload your photos and organize them into beautiful collections
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Share2 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-card-foreground">Share Instantly</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                Share your photos with friends, family, or the entire community
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-card-foreground">Like & Comment</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                Engage with the community through likes, comments, and reactions
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-card-foreground">Follow Creators</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                Discover and follow talented photographers from around the world
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/50 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Ready to Start Sharing?
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Join thousands of photographers already sharing their work
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/register">Create Your Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
