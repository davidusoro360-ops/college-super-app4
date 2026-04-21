"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ChevronDown, LayoutGrid, Rows3, PartyPopper } from "lucide-react";
import { ClassBlock, type ClassBlockPalette } from "@/components/features/ClassBlock";

interface TimetableEntry {
  _id: string;
  courseId: string;
  classroomId: string;
  facultyId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  course?: {
    _id: string;
    name: string;
    code: string;
  } | null;
  classroom?: {
    _id: string;
    name: string;
    building: string;
  } | null;
  faculty?: {
    _id: string;
    name: string;
  } | null;
  type?: "lecture" | "tutorial" | "lab";
  outline?: string[];
  resources?: string[];
}

interface TimetableGridProps {
  entries: TimetableEntry[];
  onEntryClick?: (entry: TimetableEntry) => void;
}

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FULL_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const PALETTES: ClassBlockPalette[] = [
  {
    bg: "bg-rose-200/80 dark:bg-rose-950/40",
    text: "text-rose-950 dark:text-rose-50",
    muted: "text-rose-900/70 dark:text-rose-200/70",
    chip: "bg-white/70 dark:bg-white/10",
  },
  {
    bg: "bg-purple-200/80 dark:bg-purple-950/40",
    text: "text-purple-950 dark:text-purple-50",
    muted: "text-purple-900/70 dark:text-purple-200/70",
    chip: "bg-white/70 dark:bg-white/10",
  },
  {
    bg: "bg-emerald-200/80 dark:bg-emerald-950/40",
    text: "text-emerald-950 dark:text-emerald-50",
    muted: "text-emerald-900/70 dark:text-emerald-200/70",
    chip: "bg-white/70 dark:bg-white/10",
  },
  {
    bg: "bg-sky-200/80 dark:bg-sky-950/40",
    text: "text-sky-950 dark:text-sky-50",
    muted: "text-sky-900/70 dark:text-sky-200/70",
    chip: "bg-white/70 dark:bg-white/10",
  },
  {
    bg: "bg-orange-200/80 dark:bg-orange-950/40",
    text: "text-orange-950 dark:text-orange-50",
    muted: "text-orange-900/70 dark:text-orange-200/70",
    chip: "bg-white/70 dark:bg-white/10",
  },
  {
    bg: "bg-teal-200/80 dark:bg-teal-950/40",
    text: "text-teal-950 dark:text-teal-50",
    muted: "text-teal-900/70 dark:text-teal-200/70",
    chip: "bg-white/70 dark:bg-white/10",
  },
];

function getPalette(courseId: string): ClassBlockPalette {
  const hash = courseId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PALETTES[hash % PALETTES.length];
}

function getCurrentDayOfWeek(): number {
  return new Date().getDay();
}

function isCurrentClass(entry: TimetableEntry, currentDay: number): boolean {
  if (entry.dayOfWeek !== currentDay) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [startH, startM] = entry.startTime.split(":").map(Number);
  const [endH, endM] = entry.endTime.split(":").map(Number);
  return (
    currentMinutes >= startH * 60 + startM &&
    currentMinutes < endH * 60 + endM
  );
}

function getWeekDates(): Date[] {
  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });
}

function formatHour(time: string): { num: string; period: string } {
  const [h] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const num = (h % 12 || 12).toString();
  return { num, period };
}

function diffMinutes(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}

function formatGap(mins: number): string {
  if (mins <= 0) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m === 0) return `${h} Hour${h > 1 ? "s" : ""}`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

type TimelineSlot =
  | { kind: "class"; entry: TimetableEntry }
  | { kind: "free"; startTime: string; durationMins: number };

function buildTimeline(dayEntries: TimetableEntry[]): TimelineSlot[] {
  const sorted = [...dayEntries].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );
  const out: TimelineSlot[] = [];
  for (let i = 0; i < sorted.length; i++) {
    out.push({ kind: "class", entry: sorted[i] });
    const next = sorted[i + 1];
    if (next) {
      const gap = diffMinutes(sorted[i].endTime, next.startTime);
      if (gap >= 30) {
        out.push({
          kind: "free",
          startTime: sorted[i].endTime,
          durationMins: gap,
        });
      }
    }
  }
  return out;
}

export function TimetableGrid({
  entries,
  onEntryClick,
}: TimetableGridProps) {
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [selectedDay, setSelectedDay] = useState(getCurrentDayOfWeek());

  const currentDay = getCurrentDayOfWeek();
  const weekDates = getWeekDates();
  const monthLabel = weekDates[selectedDay].toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const dayEntries = entries.filter((e) => e.dayOfWeek === selectedDay);
  const timeline = buildTimeline(dayEntries);

  const renderClassRow = (entry: TimetableEntry) => {
    const palette = getPalette(entry.courseId);
    const isNow = isCurrentClass(entry, currentDay);
    const { num, period } = formatHour(entry.startTime);

    return (
      <div key={entry._id} className="relative grid grid-cols-[72px_1fr] gap-4">
        <div className="pt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-[22px] font-bold tabular-nums text-slate-900 dark:text-slate-100">
              {num}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              {period}
            </span>
          </div>
          <div className="mt-1 text-[10.5px] tabular-nums text-slate-400 dark:text-slate-500">
            {entry.startTime}–{entry.endTime}
          </div>
        </div>
        <ClassBlock
          entry={entry}
          palette={palette}
          isNow={isNow}
          onClick={onEntryClick}
        />
      </div>
    );
  };

  const renderFreeRow = (slot: Extract<TimelineSlot, { kind: "free" }>, key: string) => {
    const { num, period } = formatHour(slot.startTime);
    return (
      <div key={key} className="relative grid grid-cols-[72px_1fr] gap-4">
        <div className="pt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-[22px] font-bold tabular-nums text-slate-300 dark:text-slate-600">
              {num}
            </span>
            <span className="text-[11px] font-semibold text-slate-300 dark:text-slate-600">
              {period}
            </span>
          </div>
        </div>
        <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-700/70 bg-slate-50/60 dark:bg-slate-900/30 p-5 flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white dark:bg-slate-800/70 text-slate-500 dark:text-slate-300">
            <PartyPopper className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-slate-700 dark:text-slate-200">
              Free Time
            </p>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
              {formatGap(slot.durationMins)} · Catch up, rest, or review notes
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <div className="px-5 sm:px-6 pt-5 pb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-slate-900 dark:text-slate-100 hover:opacity-80 transition-opacity"
        >
          {monthLabel}
          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        </button>
        <div className="flex bg-slate-100 dark:bg-slate-800/80 rounded-lg p-0.5 border border-slate-200/70 dark:border-white/5">
          <button
            onClick={() => setViewMode("day")}
            aria-label="Day view"
            className={`p-1.5 rounded-md transition-all ${
              viewMode === "day"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <Rows3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("week")}
            aria-label="Week view"
            className={`p-1.5 rounded-md transition-all ${
              viewMode === "week"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="px-3 sm:px-4 pb-4">
        <div className="flex items-stretch gap-1.5 overflow-x-auto no-scrollbar">
          {DAYS_SHORT.map((day, index) => {
            const isSelected = index === selectedDay;
            const isToday = index === currentDay;
            const date = weekDates[index];
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(index)}
                className={`relative flex-1 min-w-[52px] flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-2xl transition-all ${
                  isSelected
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                    : "bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider ${
                    isSelected
                      ? "text-white/70 dark:text-slate-600"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {day}
                </span>
                <span className="text-[17px] font-bold tabular-nums leading-none">
                  {date.getDate()}
                </span>
                {isToday && !isSelected && (
                  <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-slate-900 dark:bg-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-6">
        {viewMode === "day" ? (
          timeline.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800/60 mb-3">
                <PartyPopper className="w-6 h-6 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Nothing scheduled
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                No classes on {FULL_DAYS[selectedDay]}
              </p>
            </div>
          ) : (
            <div className="relative space-y-4">
              <div
                aria-hidden
                className="pointer-events-none absolute left-[72px] top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-slate-200 dark:via-slate-700/70 to-transparent"
              />
              {timeline.map((slot, i) =>
                slot.kind === "class"
                  ? renderClassRow(slot.entry)
                  : renderFreeRow(slot, `free-${i}`)
              )}
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {entries.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No classes this week
                </p>
              </div>
            ) : (
              [...entries]
                .sort((a, b) =>
                  a.dayOfWeek !== b.dayOfWeek
                    ? a.dayOfWeek - b.dayOfWeek
                    : a.startTime.localeCompare(b.startTime)
                )
                .map((entry) => (
                  <ClassBlock
                    key={entry._id}
                    entry={entry}
                    palette={getPalette(entry.courseId)}
                    isNow={isCurrentClass(entry, currentDay)}
                    compact
                    showDay
                    dayLabel={FULL_DAYS[entry.dayOfWeek]}
                    onClick={onEntryClick}
                  />
                ))
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
