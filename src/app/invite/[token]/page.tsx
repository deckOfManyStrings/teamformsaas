'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useInvites } from '@/hooks/use-invites'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function InviteAcceptancePage() {
  const { token } = useParams()
  const router = useRouter()
  const { acceptInvite, loading } = useInvites()
  const { user } = useAuth()
  const [status, setStatus] = useState<'checking' | 'success' | 'error' | 'needsAuth'>('checking')

  useEffect(() => {
    const handleInvite = async () => {
      if (!user) {
        setStatus('needsAuth')
        return
      }

      if (typeof token === 'string') {
        const result = await acceptInvite(token)
        if (result) {
          setStatus('success')
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        } else {
          setStatus('error')
        }
      }
    }

    if (token) {
      handleInvite()
    }
  }, [token, user, acceptInvite, router])

  if (status === 'checking' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Processing invitation...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'needsAuth') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Sign in to join team</CardTitle>
            <CardDescription>
              You need to be logged in to accept this team invitation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/auth/login" className="block">
              <Button className="w-full">Sign In</Button>
            </Link>
            <Link href="/auth/register" className="block">
              <Button variant="outline" className="w-full">Create Account</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h1 className="text-xl font-semibold mb-2">Welcome to the team!</h1>
            <p className="text-gray-600 mb-4">
              You've successfully joined the team. Redirecting to dashboard...
            </p>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-xl font-semibold mb-2">Invalid Invitation</h1>
          <p className="text-gray-600 mb-4">
            This invitation link is invalid or has expired.
          </p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}