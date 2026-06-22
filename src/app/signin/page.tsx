import Link from "next/link";
import { SignInForm } from "@/components/SignInForm";

export default function SignInPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-cloud px-5">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-5 inline-block text-sm font-semibold text-ink/65">Back to JobFinder AI</Link>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-ink/60">Use your account to access database-backed profile, watchlist, jobs, and applications.</p>
        <div className="mt-5">
          <SignInForm />
        </div>
        <p className="mt-4 text-sm text-ink/60">
          New here? <Link className="font-semibold text-moss" href="/signup">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
