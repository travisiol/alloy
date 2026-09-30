"use client";

import dynamic from "next/dynamic";

/*
 * The builder restores a saved draft from localStorage, which the server
 * cannot see, so it renders on the client only. The shell above it is
 * static and arrives with the page.
 */
const Builder = dynamic(
  () => import("@/components/forge/Builder").then((m) => m.Builder),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
        <p className="t-small text-bone-muted">Lighting the forge…</p>
      </div>
    ),
  },
);

export function ForgeClient() {
  return <Builder />;
}
