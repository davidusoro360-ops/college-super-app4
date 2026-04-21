"use client";

import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Clock,
  MapPin,
  User,
  CalendarDays,
  FileText,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import type { ClassBlockEntry } from "@/components/features/ClassBlock";

interface ClassDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: ClassBlockEntry | null;
}

const TYPE_LABELS: Record<NonNullable<ClassBlockEntry["type"]>, string> = {
  lecture: "Lecture",
  tutorial: "Tutorial",
  lab: "Lab",
};

const TYPE_STYLES: Record<NonNullable<ClassBlockEntry["type"]>, string> = {
  lecture: "bg-indigo-500/15 text-indigo-300 ring-indigo-500/30",
  tutorial: "bg-teal-500/15 text-teal-300 ring-teal-500/30",
  lab: "bg-purple-500/15 text-purple-300 ring-purple-500/30",
};

const TYPE_GRADIENTS: Record<NonNullable<ClassBlockEntry["type"]>, string> = {
  lecture: "from-indigo-500/20 via-indigo-500/5 to-transparent",
  tutorial: "from-teal-500/20 via-teal-500/5 to-transparent",
  lab: "from-purple-500/20 via-purple-500/5 to-transparent",
};

const FULL_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatTime(time: string) {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function ClassDetailsModal({
  isOpen,
  onClose,
  entry,
}: ClassDetailsModalProps) {
  const typeKey = entry?.type;
  const outline = entry?.outline ?? [];
  const resources = entry?.resources ?? [];
  const headerGradient = typeKey
    ? TYPE_GRADIENTS[typeKey]
    : "from-white/10 via-white/5 to-transparent";

  return (
    <AnimatePresence>
      {isOpen && entry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="my-8 w-full max-w-xl"
          >
            <GlassCard variant="elevated">
              <div className="relative p-6 border-b border-white/5 overflow-hidden">
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${headerGradient}`}
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {typeKey && (
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ring-1 ring-inset uppercase tracking-wider ${TYPE_STYLES[typeKey]}`}
                        >
                          {TYPE_LABELS[typeKey]}
                        </span>
                      )}
                      {entry.course?.code && (
                        <span className="text-xs font-mono tracking-tight text-slate-400">
                          {entry.course.code}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-white mt-2 leading-tight">
                      {entry.course?.name || "Unknown Course"}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="relative p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <MetaCell icon={<Clock className="w-4 h-4" />} label="Time">
                    <span className="tabular-nums">
                      {formatTime(entry.startTime)} – {formatTime(entry.endTime)}
                    </span>
                  </MetaCell>
                  <MetaCell icon={<CalendarDays className="w-4 h-4" />} label="Day">
                    {FULL_DAYS[entry.dayOfWeek] ?? ""}
                  </MetaCell>
                  <MetaCell icon={<MapPin className="w-4 h-4" />} label="Location">
                    {entry.classroom?.name || "TBA"}
                    {entry.classroom?.building
                      ? ` · ${entry.classroom.building}`
                      : ""}
                  </MetaCell>
                  <MetaCell icon={<User className="w-4 h-4" />} label="Faculty">
                    {entry.faculty?.name || "TBA"}
                  </MetaCell>
                </div>

                <section>
                  <h3 className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-[0.12em] mb-2.5">
                    Course Outline
                  </h3>
                  {outline.length > 0 ? (
                    <ul className="space-y-2">
                      {outline.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed"
                        >
                          <span className="mt-2 w-1 h-1 rounded-full bg-indigo-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">
                      No outline has been added for this class yet.
                    </p>
                  )}
                </section>

                <section>
                  <h3 className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-[0.12em] mb-2.5">
                    Resources
                  </h3>
                  {resources.length > 0 ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      {resources.map((r) => (
                        <span
                          key={r}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/10 text-slate-200"
                        >
                          <FileText className="w-3 h-3 opacity-70" />
                          {r}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      No resources have been attached yet.
                    </p>
                  )}
                </section>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MetaCell({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5">
      <div className="mt-0.5 text-slate-400 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.12em]">
          {label}
        </p>
        <p className="text-sm text-slate-200 mt-0.5 truncate">{children}</p>
      </div>
    </div>
  );
}
