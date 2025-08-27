import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Team Form Management</CardTitle>
            <CardDescription>
              Create teams, build forms, and collect submissions
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
    </div>
  )
}