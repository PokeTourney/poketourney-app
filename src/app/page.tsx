import Link from "next/link";

import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="flex flex-col items-center justify-center gap-4">
            <Link
              href="/demo/spectator"
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              Spectator
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <Link
              href="/demo/p1"
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              Player 1
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <Link
              href="/demo/p2"
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              Player 2
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <Link
              href="/demo/omniscient"
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              Omniscient
            </Link>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
