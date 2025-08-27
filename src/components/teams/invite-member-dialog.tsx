'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus, Copy } from 'lucide-react'
import { useInvites } from '@/hooks/use-invites'

interface InviteMemberDialogProps {
  teamId: string
}

export function InviteMemberDialog({ teamId }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [inviteLink, setInviteLink] = useState('')
  const { createInvite, loading } = useInvites(teamId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) return

    const result = await createInvite(email.trim())
    if (result) {
      setInviteLink(result.link)
      setEmail('')
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink)
    // Could add toast here but it's already shown in createInvite
  }

  const resetDialog = () => {
    setEmail('')
    setInviteLink('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Members
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {!inviteLink ? (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Invite team member</DialogTitle>
              <DialogDescription>
                Enter the email address of the person you want to invite to your team.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="person@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !email.trim()}>
                {loading ? 'Creating invite...' : 'Send Invite'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div>
            <DialogHeader>
              <DialogTitle>Invite created!</DialogTitle>
              <DialogDescription>
                Share this link with your team member. It expires in 7 days.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex space-x-2">
                <Input value={inviteLink} readOnly className="flex-1" />
                <Button size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={resetDialog}>Done</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}