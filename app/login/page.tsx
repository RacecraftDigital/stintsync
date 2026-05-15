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
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
        <img
          src="/stintsync-logo.png"
          alt="StintSync by Racecraft Digital"
          className="mb-5 h-auto w-full max-w-[340px] object-contain"
        />
        <p className="text-zinc-400 mb-6">Sign in with Discord to continue</p>

        <button
          onClick={signInWithDiscord}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold hover:bg-indigo-500"
        >
          Sign in with Discord
        </button>
      </div>
    </main>
  );
}
