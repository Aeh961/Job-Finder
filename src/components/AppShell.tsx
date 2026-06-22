import Link from "next/link";
import { BriefcaseBusiness, Building2, ClipboardList, FileText, LayoutDashboard, Rocket, Settings, Sparkles, UserRound } from "lucide-react";

const navItems = [
  { href: "/onboarding", label: "Onboarding", icon: Rocket },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/employers", label: "Employers", icon: Building2 },
  { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/applications", label: "Applications", icon: ClipboardList },
  { href: "/packets", label: "Packets", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children, title, action }: { children: React.ReactNode; title: string; action?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cloud">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-white px-4 py-5 lg:block">
        <Link href="/" className="mb-8 flex items-center gap-3 px-2">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-ink text-sm font-bold text-white">JF</span>
          <span>
            <span className="block text-sm font-semibold">JobFinder AI</span>
            <span className="text-xs text-ink/55">MVP workspace</span>
          </span>
        </Link>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-ink/70 hover:bg-cloud hover:text-ink">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <header className="border-b border-line bg-white px-5 py-4 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-semibold tracking-normal text-ink">{title}</h1>
            {action}
          </div>
        </header>
        <div className="px-5 py-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
