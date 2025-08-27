"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export type Team = {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  team_id: string | null;
  role: "manager" | "member";
  email: string | null;
  name: string | null;
  created_at: string;
};

export function useTeams() {
  const [team, setTeam] = useState<Team | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  // Fetch user profile and team
const fetchProfileAndTeam = async () => {
  if (!user) {
    setLoading(false)
    return
  }

  try {
    console.log('Fetching profile for user:', user.id)
    
    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle() // Use maybeSingle instead of single to handle no results

    console.log('Profile query result:', { profileData, profileError })

    // If no profile exists, create one
    if (!profileData && !profileError) {
      console.log('Creating new profile for user:', user.id)
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || null,
          role: 'member',
          team_id: null
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating profile:', createError)
        throw createError
      }

      console.log('New profile created:', newProfile)
      setProfile(newProfile)
      setTeam(null)
      return
    }

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      throw profileError
    }

    setProfile(profileData)

    // Get team if user has one
    if (profileData.team_id) {
      console.log('Fetching team:', profileData.team_id)
      
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', profileData.team_id)
        .single()

      if (teamError) {
        console.error('Error fetching team:', teamError)
        throw teamError
      }

      console.log('Team data:', teamData)
      setTeam(teamData)
    } else {
      setTeam(null)
    }
  } catch (error) {
    console.error('Error in fetchProfileAndTeam:', error)
    // Don't throw - just log and continue
  } finally {
    setLoading(false)
  }
}

  // Create a new team
  const createTeam = async (teamName: string) => {
    if (!user) return null;

    try {
      setLoading(true);

      // Create team
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .insert({
          name: teamName,
          owner_id: user.id,
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Update user profile to be manager and assign to team
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          team_id: teamData.id,
          role: "manager",
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      setTeam(teamData);
      setProfile((prev) =>
        prev ? { ...prev, team_id: teamData.id, role: "manager" } : null
      );
      toast.success("Team created successfully!");
      return teamData;
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Failed to create team");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndTeam();
  }, [user]);

  return {
    team,
    profile,
    loading,
    createTeam,
    refetch: fetchProfileAndTeam,
  };
}
