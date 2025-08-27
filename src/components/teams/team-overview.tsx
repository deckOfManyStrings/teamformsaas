"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InviteMemberDialog } from "./invite-member-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Settings, UserPlus } from "lucide-react";
import { useTeams } from "@/hooks/use-teams";
import { CreateTeamDialog } from "./create-team-dialog";

export function TeamOverview() {
  const { team, profile, loading, refetch } = useTeams();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading team information...</div>
        </CardContent>
      </Card>
    );
  }

  // User has no team
  if (!team) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Your Team</CardTitle>
          <CardDescription>
            Get started by creating a team. You&apos;ll be able to invite
            members and create forms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTeamDialog onTeamCreated={refetch} />
        </CardContent>
      </Card>
    );
  }

  // User has a team
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>{team.name}</span>
                <Badge
                  variant={
                    profile?.role === "manager" ? "default" : "secondary"
                  }
                >
                  {profile?.role}
                </Badge>
              </CardTitle>
              <CardDescription>
                {profile?.role === "manager"
                  ? "You are the team owner"
                  : "You are a team member"}
              </CardDescription>
            </div>
            {profile?.role === "manager" && (
              <div className="flex items-center space-x-2">
                <InviteMemberDialog teamId={team.id} />
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>1 member</span> {/* We'll update this later */}
            </div>
            <div>Created {new Date(team.created_at).toLocaleDateString()}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
