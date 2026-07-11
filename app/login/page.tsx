"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  async function signInWithDiscord() {
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/login`,
      },
    });
  }


  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.log(error);
      }

      if (data.user) {
        const discordName =
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          data.user.user_metadata?.preferred_username ||
          data.user.user_metadata?.user_name ||
          data.user.user_metadata?.provider_id ||
          "Discord User";

        await supabase.from("profiles").upsert({
          id: data.user.id,
          username: discordName,
          display_name: discordName,
          avatar_url: data.user.user_metadata?.avatar_url || null,
        });

        router.replace("/");
        return;
      }

      setLoading(false);
    }

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#0c0d10_0%,#14161a_55%,#0a0b0d_100%)] text-white flex items-center justify-center">
        <p className="text-zinc-400 font-mono text-sm tracking-widest uppercase">
          Loading...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_15%,rgba(245,166,35,0.12),transparent_35%),radial-gradient(circle_at_85%_85%,rgba(245,166,35,0.06),transparent_30%),linear-gradient(180deg,#0c0d10_0%,#14161a_55%,#0a0b0d_100%)] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md overflow-hidden rounded-[1.65rem] border border-white/10 bg-zinc-900/70 backdrop-blur-xl p-8 shadow-2xl shadow-black/50">
        <p className="mb-1 text-center text-[10px] font-bold uppercase tracking-[0.32em] text-amber-400">
          Racecraft Digital
        </p>
        <img
          src="/stintsync-logo.png"
          alt="StintSync by Racecraft Digital"
          className="mb-6 h-auto w-full max-w-[300px] object-contain mx-auto"
        />
        <p className="text-zinc-400 mb-6 text-center text-sm">
          Sign in with Discord to continue to your pit wall
        </p>

        <button
          onClick={signInWithDiscord}
          className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-3 font-bold text-zinc-950 shadow-lg shadow-amber-950/40 transition hover:from-amber-400 hover:to-amber-300"
        >
          Sign in with Discord
        </button>

        <p className="mt-6 text-center text-[10px] uppercase tracking-[0.2em] text-zinc-600">
          Endurance stint planning · built for teams
        </p>
      </div>
    </main>
  );
}
