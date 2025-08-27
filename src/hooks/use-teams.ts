'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

export type Team = {
  id: string
  name: string
  owner_id: string
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string
  team_id: string | null
  role: 'manager' | 'member'
  email: string | null
  name: string | null
  created_at: string
}

export function useTeams() {
  const [team, setTeam] = useState<Team | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  // Fetch user profile and team
  const fetchProfileAndTeam = async () => {
    if (!user) return

    try {
      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError
      setProfile(profileData)

      // Get team if user has one
      if (profileData.team_id) {
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select('*')
          .eq('id', profileData.team_id)
          .single()

        if (teamError) throw teamError
        setTeam(teamData)
      }
    } catch (error) {
      console.error('Error fetching profile and team:', error)
    } finally {
      setLoading(false)
    }
  }

  // Create a new team
  const createTeam = async (teamName: string) => {
    if (!user) return null

    try {
      setLoading(true)

      // Create team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: teamName,
          owner_id: user.id,
        })
        .select()
        .single()

      if (teamError) throw teamError

      // Update user profile to be manager and assign to team
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          team_id: teamData.id,
          role: 'manager',
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      setTeam(teamData)
      setProfile(prev => prev ? { ...prev, team_id: teamData.id, role: 'manager' } : null)
      toast.success('Team created successfully!')
      return teamData
    } catch (error) {
      console.error('Error creating team:', error)
      toast.error('Failed to create team')
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfileAndTeam()
  }, [user])

  return {
    team,
    profile,
    loading,
    createTeam,
    refetch: fetchProfileAndTeam,
  }
}