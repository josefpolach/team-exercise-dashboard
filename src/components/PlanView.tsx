import type { WeeklyPlan } from "@/types";

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function PlanView({ plan }: { plan: WeeklyPlan | null }) {
  if (!plan) {
    return (
      <div className="text-center py-12 text-stone-400">
        <div className="text-4xl mb-3">📋</div>
        <p className="text-lg">Pro tento týden ještě není plán.</p>
        <p className="text-sm mt-1">Trenér ho brzy přidá!</p>
      </div>
    );
  }

  const youtubeId = plan.videoUrl ? getYouTubeId(plan.videoUrl) : null;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
        <div className="prose prose-stone max-w-none whitespace-pre-wrap text-stone-700">
          {plan.description}
        </div>
      </div>

      {youtubeId && (
        <div className="rounded-2xl overflow-hidden shadow-sm border border-stone-100">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
              title="Video ukázka"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {plan.videoUrl && !youtubeId && (
        <a
          href={plan.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white rounded-2xl p-4 shadow-sm border border-stone-100 text-accent hover:underline"
        >
          🎬 Odkaz na video ukázku
        </a>
      )}
    </div>
  );
}
