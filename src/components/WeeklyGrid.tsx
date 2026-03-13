import { getWeekDates, getDayNameShort, formatDate, formatDateShort, isToday as checkIsToday } from "@/lib/week";
import type { User, CheckIn, HighFive } from "@/types";
import UserAvatar from "./UserAvatar";
import CheckInCell from "./CheckInCell";

interface Props {
  weekId: string;
  users: User[];
  checkIns: CheckIn[];
  highFives: HighFive[];
  currentUserId: string;
}

export default function WeeklyGrid({ weekId, users, checkIns, highFives, currentUserId }: Props) {
  const dates = getWeekDates(weekId);
  const today = new Date();
  const todayStr = formatDate(today);

  // Index check-ins by `userId_date`
  const checkInMap = new Map<string, CheckIn>();
  for (const ci of checkIns) {
    checkInMap.set(`${ci.userId}_${ci.date}`, ci);
  }

  // Count high-fives per `toUserId_date` and track which ones current user gave
  const hfCountMap = new Map<string, number>();
  const hfGivenMap = new Set<string>();
  for (const hf of highFives) {
    const key = `${hf.toUserId}_${hf.date}`;
    hfCountMap.set(key, (hfCountMap.get(key) || 0) + 1);
    if (hf.fromUserId === currentUserId) {
      hfGivenMap.add(key);
    }
  }

  return (
    <div className="overflow-x-auto">
      <div className="grid gap-1 min-w-[600px]" style={{ gridTemplateColumns: "140px repeat(7, 1fr)" }}>
        {/* Header row */}
        <div />
        {dates.map((date, i) => {
          const isTodayCol = checkIsToday(date);
          return (
            <div
              key={i}
              className={`text-center py-2 rounded-xl text-sm font-medium ${
                isTodayCol ? "bg-accent text-white" : "text-stone-500"
              }`}
            >
              <div>{getDayNameShort(i)}</div>
              <div className="text-xs">{formatDateShort(date)}</div>
            </div>
          );
        })}

        {/* User rows */}
        {users.map((user) => (
          <>
            <div key={`name-${user.userId}`} className="flex items-center gap-2 py-1 pr-2">
              <UserAvatar name={user.displayName} isCoach={user.role === "coach"} />
              <span className="text-sm font-medium text-stone-700 truncate">
                {user.displayName.split(" ")[0]}
              </span>
            </div>
            {dates.map((date, dayIdx) => {
              const dateStr = formatDate(date);
              const isTodayCell = checkIsToday(date);
              const isPast = date < today && !isTodayCell;
              const isSelf = user.userId === currentUserId;
              const key = `${user.userId}_${dateStr}`;
              const checkIn = checkInMap.get(key) || null;
              const hfCount = hfCountMap.get(key) || 0;
              const hasHf = hfGivenMap.has(key);

              return (
                <div key={`${user.userId}-${dayIdx}`} className="p-0.5">
                  <CheckInCell
                    checkIn={checkIn}
                    isToday={isTodayCell}
                    isPast={isPast}
                    isSelf={isSelf}
                    highFiveCount={hfCount}
                    hasGivenHighFive={hasHf}
                    userId={user.userId}
                    date={dateStr}
                    currentUserId={currentUserId}
                  />
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}
