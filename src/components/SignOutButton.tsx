"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold" onClick={() => signOut({ callbackUrl: "/" })} type="button">
      Sign out
    </button>
  );
}
