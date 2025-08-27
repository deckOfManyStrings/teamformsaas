'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { generateInviteToken, getInviteExpiration, createInviteLink } from '@/lib/invite-utils'
import { toast } from 'sonner'

export type Invite = {
  id: string
  team_id: string
  email: string
  token: string
  expires_at: string
  used_at: string | null
  created_at: string
}

export function useInvites(teamId?: string) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const createInvite = async (email: string) => {
    if (!teamId) return null

    try {
      setLoading(true)
      const token = generateInviteToken()
      const expiresAt = getInviteExpiration()

      const { data, error } = await supabase
        .from('invites')
        .insert({
          team_id: teamId,
          email,
          token,
          expires_at: expiresAt,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single()

      if (error) throw error

      const inviteLink = createInviteLink(token)
      toast.success(`Invite created! Link: ${inviteLink}`)
      
      return { invite: data, link: inviteLink }
    } catch (error) {
      console.error('Error creating invite:', error)
      toast.error('Failed to create invite')
      return null
    } finally {
      setLoading(false)
    }
  }

  const acceptInvite = async (token: string) => {
    try {
      setLoading(true)
      
      // Get invite by token
      const { data: invite, error: inviteError } = await supabase
        .from('invites')
        .select('*')
        .eq('token', token)
        .is('used_at', null)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (inviteError || !invite) {
        throw new Error('Invalid or expired invite')
      }

      const user = (await supabase.auth.getUser()).data.user
      if (!user) {
        throw new Error('Must be logged in to accept invite')
      }

      // Update user profile to join team
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          team_id: invite.team_id,
          role: 'member',
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Mark invite as used
      const { error: updateError } = await supabase
        .from('invites')
        .update({ used_at: new Date().toISOString() })
        .eq('id', invite.id)

      if (updateError) throw updateError

      toast.success('Successfully joined the team!')
      return invite
    } catch (error) {
      console.error('Error accepting invite:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to accept invite')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    createInvite,
    acceptInvite,
    loading,
  }
}