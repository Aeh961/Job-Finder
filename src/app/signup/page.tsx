import Link from "next/link";
import { signUpAction } from "@/app/actions";

export default function SignUpPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-cloud px-5">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-5 inline-block text-sm font-semibold text-ink/65">Back to JobFinder AI</Link>
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="mt-2 text-sm text-ink/60">V3 stores your profile, resume, employers, saved jobs, and applications by user.</p>
        <form action={signUpAction} className="mt-5 grid gap-4 rounded-md border border-line bg-white p-5 shadow-soft">
          <label className="text-sm font-medium">
            Name
            <input className="mt-2 rounded-md border border-line px-3 py-2" name="name" />
          </label>
          <label className="text-sm font-medium">
            Email
            <input className="mt-2 rounded-md border border-line px-3 py-2" name="email" type="email" required />
          </label>
          <label className="text-sm font-medium">
            Password
            <input className="mt-2 rounded-md border border-line px-3 py-2" name="password" type="password" minLength={8} required />
          </label>
          <button className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white" type="submit">Create account</button>
        </form>
      </div>
    </main>
  );
}
