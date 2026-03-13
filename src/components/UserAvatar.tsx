function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const COLORS = [
  "bg-orange-100 text-orange-700",
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
  "bg-yellow-100 text-yellow-700",
  "bg-teal-100 text-teal-700",
  "bg-red-100 text-red-700",
  "bg-indigo-100 text-indigo-700",
  "bg-cyan-100 text-cyan-700",
];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function UserAvatar({
  name,
  size = "sm",
  isCoach,
}: {
  name: string;
  size?: "sm" | "md";
  isCoach?: boolean;
}) {
  const initials = getInitials(name);
  const color = getColor(name);
  const sizeClass = size === "md" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs";

  return (
    <div
      className={`${sizeClass} ${color} rounded-full flex items-center justify-center font-bold shrink-0 ${
        isCoach ? "ring-2 ring-accent" : ""
      }`}
      title={name}
    >
      {initials}
    </div>
  );
}
