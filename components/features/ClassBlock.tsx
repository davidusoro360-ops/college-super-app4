"use client";

import type { KeyboardEvent, MouseEvent } from "react";
import { MoreHorizontal, Clock } from "lucide-react";

export interface ClassBlockEntry {
  _id: string;
  courseId: string;
  classroomId: string;
  facultyId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  course?: { _id: string; name: string; code: string } | null;
  classroom?: { _id: string; name: string; building: string } | null;
  faculty?: { _id: string; name: string } | null;
  type?: "lecture" | "tutorial" | "lab";
  outline?: string[];
  resources?: string[];
}

export interface ClassBlockPalette {
  bg: string;
  text: string;
  muted: string;
  chip: string;
}

interface ClassBlockProps {
  entry: ClassBlockEntry;
  palette: ClassBlockPalette;
  isNow?: boolean;
  compact?: boolean;
  showDay?: boolean;
  dayLabel?: string;
  onClick?: (entry: ClassBlockEntry) => void;
}

const TYPE_LABELS: Record<NonNullable<ClassBlockEntry["type"]>, string> = {
  lecture: "Lecture",
  tutorial: "Tutorial",
  lab: "Lab",
};

function initials(name: string): string {
  const stripped = name
    .trim()
    .split(/\s+/)
    .filter((p) => p && !/^(dr|mr|ms|mrs|prof|sir)\.?$/i.test(p));
  const source = stripped.length > 0 ? stripped : name.trim().split(/\s+/);
  const letters = source
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("");
  return letters.toUpperCase() || "?";
}

function formatDuration(start: string, end: string): string {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const mins = eh * 60 + em - (sh * 60 + sm);
  if (mins <= 0) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m === 0) return `${h} Hour${h > 1 ? "s" : ""}`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

export function ClassBlock({
  entry,
  palette,
  isNow,
  compact = false,
  showDay,
  dayLabel,
  onClick,
}: ClassBlockProps) {
  const courseName = entry.course?.name || "Unknown Course";
  const description =
    entry.outline?.[0] ||
    (entry.type && entry.course?.code
      ? `${TYPE_LABELS[entry.type]} · Covers key topics and in-class work.`
      : "Covers key topics and in-class work.");
  const roomName = entry.classroom?.name || "TBA";
  const facultyName = entry.faculty?.name || "";
  const duration = formatDuration(entry.startTime, entry.endTime);

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(entry);
    }
  };

  if (compact) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onClick?.(entry)}
        onKeyDown={handleKey}
        className={`group relative overflow-hidden cursor-pointer rounded-2xl p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30 dark:focus-visible:ring-white/30 ${palette.bg}`}
      >
        <p className={`text-[9.5px] font-semibold uppercase tracking-wider tabular-nums ${palette.muted}`}>
          {entry.startTime}
        </p>
        <p className={`font-semibold text-[12px] leading-snug mt-0.5 line-clamp-2 ${palette.text}`}>
          {courseName}
        </p>
        {showDay && dayLabel && (
          <p className={`text-[9.5px] mt-1 ${palette.muted}`}>{dayLabel}</p>
        )}
        <p className={`text-[10px] mt-1 truncate ${palette.muted}`}>
          Room {roomName}
        </p>
        {isNow && (
          <span
            className={`inline-flex items-center gap-1 mt-1.5 px-1.5 py-[1px] rounded-full text-[8.5px] font-bold uppercase tracking-wider ${palette.chip} ${palette.text}`}
          >
            <span className="relative flex h-1 w-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
              <span className="relative inline-flex rounded-full h-1 w-1 bg-current" />
            </span>
            Live
          </span>
        )}
      </div>
    );
  }

  const handleMenu = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick?.(entry);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(entry)}
      onKeyDown={handleKey}
      className={`group relative overflow-hidden rounded-3xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900/30 dark:focus-visible:ring-white/30 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 ${palette.bg} ${
        isNow
          ? "ring-2 ring-slate-900/15 dark:ring-white/20 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
          : ""
      }`}
    >
      <svg
        className={`pointer-events-none absolute -top-10 -right-10 w-44 h-44 opacity-40 ${palette.muted}`}
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden
      >
        <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="56" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      <svg
        className={`pointer-events-none absolute -bottom-16 -left-8 w-40 h-40 opacity-25 ${palette.muted}`}
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden
      >
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={`font-bold text-[17px] leading-tight ${palette.text}`}>
            {courseName}
          </h3>
          <p className={`text-[13px] mt-1.5 leading-snug line-clamp-2 ${palette.muted}`}>
            {description}
          </p>
        </div>
        <button
          type="button"
          aria-label="Open class details"
          onClick={handleMenu}
          className={`shrink-0 p-1.5 rounded-full transition-opacity hover:opacity-80 ${palette.chip} ${palette.text}`}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="relative mt-6 flex items-end gap-6">
        <div>
          <p className={`text-[11px] font-medium ${palette.muted}`}>Room</p>
          <p className={`text-[28px] leading-none font-bold tabular-nums mt-1 ${palette.text}`}>
            {roomName}
          </p>
        </div>
        {entry.course?.code && (
          <div>
            <p className={`text-[11px] font-medium ${palette.muted}`}>Code</p>
            <p className={`text-[28px] leading-none font-bold tabular-nums mt-1 ${palette.text}`}>
              {entry.course.code}
            </p>
          </div>
        )}
      </div>

      <div className="relative mt-5 flex items-center justify-between gap-3">
        <div className={`flex items-center gap-1.5 text-[13px] font-medium ${palette.muted}`}>
          <Clock className="w-3.5 h-3.5" />
          {duration}
          {showDay && dayLabel && (
            <span className="ml-2 opacity-80">· {dayLabel}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isNow && (
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${palette.chip} ${palette.text}`}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
              </span>
              Live
            </span>
          )}
          {facultyName && (
            <div
              aria-label={facultyName}
              className={`flex items-center justify-center w-9 h-9 rounded-full ring-2 ring-white/60 dark:ring-white/10 font-bold text-[11px] ${palette.chip} ${palette.text}`}
            >
              {initials(facultyName)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
