"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await signIn("credentials", {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        redirect: false
      });

      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <form action={onSubmit} className="grid gap-4 rounded-md border border-line bg-white p-5 shadow-soft">
      {params.get("created") ? <p className="rounded-md bg-moss/10 px-3 py-2 text-sm text-moss">Account created. Sign in to continue.</p> : null}
      {error ? <p className="rounded-md bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p> : null}
      <label className="text-sm font-medium">
        Email
        <input className="mt-2 rounded-md border border-line px-3 py-2" name="email" type="email" defaultValue={process.env.NEXT_PUBLIC_AUTH_MODE === "stub" ? "demo@jobfinder.ai" : ""} required />
      </label>
      <label className="text-sm font-medium">
        Password
        <input className="mt-2 rounded-md border border-line px-3 py-2" name="password" type="password" placeholder="password123" required />
      </label>
      <button className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" disabled={isPending} type="submit">
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
