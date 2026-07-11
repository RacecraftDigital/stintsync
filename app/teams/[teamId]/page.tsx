
"use client";

// Team manager visual cleanup v46
// Invite button state + active members fix v47

// v20 self-invite guard and pending invites

// Teams manage return flow v4

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Team = { id: string; name: string; owner_id: string; created_at: string };
type Profile = { id: string; username: string | null; display_name: string | null; avatar_url: string | null };
type MemberProfile = Profile | null;
type TeamMemberRow = { id: string; team_id: string; user_id: string; role: string | null; status: string | null; profiles: MemberProfile };
type TeamInviteRow = { id: string; team_id: string; invited_user_id: string; invited_by: string; status: string | null; created_at: string; invited_profile: MemberProfile };

export default function ManageTeamPage() {
  const params = useParams<{ teamId: string }>();
  const teamId = params.teamId;
  const [userId, setUserId] = useState<string | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMemberRow[]>([]);
  const [sentInvites, setSentInvites] = useState<TeamInviteRow[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [searchMessage, setSearchMessage] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const isOwner = useMemo(() => team?.owner_id === userId, [team, userId]);

  async function loadTeamPage() {
    setLoading(true);
    setMessage("");
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setMessage("You are not signed in. Go to /login first.");
      setLoading(false);
      return;
    }
    setUserId(userData.user.id);

    const { data: teamData, error: teamError } = await supabase.from("teams").select("*").eq("id", teamId).single();
    if (teamError) {
      setMessage(teamError.message);
      setLoading(false);
      return;
    }
    setTeam(teamData as Team);
    await loadTeamDetails();
    setLoading(false);
  }

  async function loadTeamDetails() {
    const { data: memberData, error: memberError } = await supabase
      .from("team_members")
      .select(`id, team_id, user_id, role, status, profiles:user_id (id, username, display_name, avatar_url)`)
      .eq("team_id", teamId)
      .eq("status", "active")
      .order("created_at", { ascending: true });
    if (memberError) setMessage(memberError.message);
    else setMembers((memberData || []) as unknown as TeamMemberRow[]);

    const { data: inviteData, error: inviteError } = await supabase
      .from("team_invites")
      .select(`id, team_id, invited_user_id, invited_by, status, created_at, invited_profile:invited_user_id (id, username, display_name, avatar_url)`)
      .eq("team_id", teamId)
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (inviteError) setMessage(inviteError.message);
    else setSentInvites((inviteData || []) as unknown as TeamInviteRow[]);
  }

  async function searchUsers() {
    setSearchMessage("");
    setSearchResults([]);
    if (!searchText.trim()) return setSearchMessage("Type part of a username first.");
    const query = searchText.trim();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url")
      .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
      .limit(10);
    if (error) return setSearchMessage(error.message);
    const results = (data || []) as Profile[];
    setSearchResults(results);
    setSearchMessage(results.length ? `Found ${results.length} user(s).` : "No users found. They need to log in with Discord once first.");
  }

  async function inviteUser(profile: Profile) {
    setMessage("");

    if (!userId) return setMessage("Sign in first.");
    if (!isOwner) return setMessage("Only the team owner can invite drivers.");
    if (profile.id === userId) return setMessage("You cannot invite yourself.");

    if (members.some((m) => m.user_id === profile.id && m.status === "active")) {
      return setMessage("That user is already on the team.");
    }

    if (sentInvites.some((invite) => invite.invited_user_id === profile.id && (invite.status || "pending") === "pending")) {
      return setMessage("That user is already invited.");
    }

    const optimisticInvite: TeamInviteRow = {
      id: `local-${profile.id}`,
      team_id: teamId,
      invited_user_id: profile.id,
      invited_by: userId,
      status: "pending",
      created_at: new Date().toISOString(),
      invited_profile: profile,
    };

    setSentInvites((prev) => [optimisticInvite, ...prev]);

    const { data, error } = await supabase
      .from("team_invites")
      .upsert({
        team_id: teamId,
        invited_user_id: profile.id,
        invited_by: userId,
        status: "pending",
      }, { onConflict: "team_id,invited_user_id" })
      .select(`id, team_id, invited_user_id, invited_by, status, created_at, invited_profile:invited_user_id (id, username, display_name, avatar_url)`)
      .single();

    if (error) {
      setSentInvites((prev) => prev.filter((invite) => invite.id !== optimisticInvite.id));
      return setMessage(error.message);
    }

    setSentInvites((prev) => [
      data as unknown as TeamInviteRow,
      ...prev.filter((invite) => invite.invited_user_id !== profile.id),
    ]);

    setMessage("Invite sent.");
  }

  async function removeMember(member: TeamMemberRow) {
    if (!window.confirm("Remove this member from the team?")) return;
    const { error } = await supabase.from("team_members").delete().eq("id", member.id);
    if (error) return setMessage(error.message);
    setMessage("Member removed.");
    await loadTeamDetails();
  }

  useEffect(() => { loadTeamPage(); }, [teamId]);

  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-6 shadow-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <a href={`/?page=Teams&team=${teamId}`} className="text-sm font-semibold text-amber-400 hover:text-amber-300">← Back to Team</a>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">Team Manager</p>
              <h1 className="mt-1 text-4xl font-black tracking-tight">Manage {team?.name || "Team"}</h1>
              <p className="mt-2 max-w-3xl text-zinc-400">
                View drivers, send Discord invites, and manage pending team invitations.
              </p>
            </div>

            <a href="/" className="rounded-2xl bg-zinc-800 px-5 py-3 font-bold transition hover:bg-zinc-700">
              StintSync
            </a>
          </div>
        </div>

        {message && (
          <div className="rounded-2xl border border-zinc-700 bg-zinc-900/90 p-4 text-sm text-zinc-200 shadow-lg">
            {message}
          </div>
        )}

        {loading ? (
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-zinc-400 shadow-xl">
            Loading team details...
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
              <div className="mb-5 flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Members</h2>
                  <p className="mt-1 text-sm text-zinc-400">Drivers currently on this team.</p>
                </div>
                <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-300">
                  {members.length} active
                </span>
              </div>

              {members.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 p-8 text-center">
                  <p className="font-semibold text-zinc-200">No members loaded.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                      <div className="flex min-w-0 items-center gap-3">
                        {member.profiles?.avatar_url ? (
                          <img src={member.profiles.avatar_url} alt="" className="h-10 w-10 rounded-full border border-zinc-700" />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-600 font-black">
                            {(member.profiles?.display_name || member.profiles?.username || "U").slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-bold">{member.profiles?.display_name || member.profiles?.username || "Unknown User"}</p>
                          <p className="text-xs text-zinc-500">Role: {member.role || "driver"} · Status: {member.status || "active"}</p>
                        </div>
                      </div>
                      {isOwner && member.user_id !== userId && (
                        <button onClick={() => removeMember(member)} className="rounded-xl bg-red-600 px-3 py-2 text-sm font-bold hover:bg-red-500">
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
              <div className="mb-5">
                <h2 className="text-2xl font-bold">Invite Drivers</h2>
                <p className="mt-1 text-sm text-zinc-400">Search by Discord username and send an invite.</p>
              </div>

              {!isOwner && (
                <p className="mb-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">
                  Only the team owner can invite people.
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search Discord username"
                  className="min-w-0 flex-1 rounded-2xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none focus:border-amber-500"
                />
                <button onClick={searchUsers} className="rounded-2xl bg-amber-600 px-5 py-3 font-bold hover:bg-amber-500">
                  Search
                </button>
              </div>

              {searchMessage && <p className="mt-3 text-sm text-zinc-300">{searchMessage}</p>}

              {searchResults.length > 0 && (
                <div className="mt-5 space-y-3">
                  {searchResults.map((profile) => (
                    <div key={profile.id} className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                      <div className="min-w-0">
                        <p className="truncate font-bold">{profile.display_name || profile.username || "Discord User"}</p>
                        <p className="text-xs text-zinc-500">{profile.id}</p>
                      </div>
                      {(() => {
                        const alreadyMember = members.some((member) => member.user_id === profile.id && member.status === "active");
                        const alreadyInvited = sentInvites.some((invite) => invite.invited_user_id === profile.id && (invite.status || "pending") === "pending");
                        const disabled = !isOwner || alreadyMember || alreadyInvited;

                        return (
                          <button
                            disabled={disabled}
                            onClick={() => inviteUser(profile)}
                            className={`rounded-xl px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed ${
                              alreadyMember
                                ? "bg-zinc-700 text-zinc-300"
                                : alreadyInvited
                                  ? "bg-amber-700 text-white"
                                  : "bg-green-600 text-white hover:bg-green-500"
                            }`}
                          >
                            {alreadyMember ? "On Team" : alreadyInvited ? "Invited" : "Invite"}
                          </button>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl lg:col-span-2">
              <div className="mb-5 flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Pending Invites</h2>
                  <p className="mt-1 text-sm text-zinc-400">Invites that have not been accepted or declined yet.</p>
                </div>
                <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-300">
                  {sentInvites.length} pending
                </span>
              </div>

              {sentInvites.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 p-8 text-center">
                  <p className="font-semibold text-zinc-200">No pending invites.</p>
                  <p className="mt-2 text-sm text-zinc-500">Search for a driver above to send one.</p>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {sentInvites.map((invite) => (
                    <div key={invite.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                      <p className="font-bold">{invite.invited_profile?.display_name || invite.invited_profile?.username || "Unknown User"}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">Status: {invite.status || "pending"}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );

}
