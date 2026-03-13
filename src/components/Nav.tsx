import Link from "next/link";

export default function Nav({ currentPath, isCoach }: { currentPath?: string; isCoach?: boolean }) {
  const links = [
    { href: "/", label: "Přehled", icon: "📊" },
    { href: "/checkin", label: "Check-in", icon: "✍️" },
    { href: "/plan", label: "Plán", icon: "📋" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-stone-900 hover:text-accent transition-colors">
          Cvičba 💪
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                currentPath === link.href
                  ? "bg-accent text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <span className="sm:hidden">{link.icon}</span>
              <span className="hidden sm:inline">{link.icon} {link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
