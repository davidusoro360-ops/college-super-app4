"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TimetableGrid } from "@/components/features/TimetableGrid";
import { ClassDetailsModal } from "@/components/modals";
import type { ClassBlockEntry } from "@/components/features/ClassBlock";
import { useTimetableData } from "@/lib/data";
import type { TimetableEntry } from "@/lib/data";
import {
  Clock,
  Calendar,
  CalendarDays,
  Download,
  BookOpen,
  GraduationCap,
  Briefcase,
} from "lucide-react";

export default function TimetablePage() {
  const { user } = useUser();
  const [selectedEntry, setSelectedEntry] = useState<ClassBlockEntry | null>(null);

  const currentUser = useQuery(
    api.users.getUser,
    user?.id ? { clerkUserId: user.id } : "skip"
  );

  const timetableData = useTimetableData(
    user?.id
      ? {
          clerkUserId: user.id,
          collegeId: currentUser?.collegeId,
          ready: currentUser !== undefined,
        }
      : null
  );

  const weeklyTimetable = timetableData?.weeklyTimetable;

  const isStaff = currentUser?.role === "faculty" ||
                  currentUser?.role === "admin" ||
                  currentUser?.role === "hostelAdmin" ||
                  currentUser?.role === "canteenAdmin";

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.14em]">
            <CalendarDays className="w-3.5 h-3.5" />
            This Week
          </div>
          <h1 className="text-2xl md:text-[28px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
            Timetable
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {currentUser?.role === "faculty"
              ? "Your teaching schedule for the week"
              : "Your class schedule for the week"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {isStaff && (
            <Button variant="primary" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          )}
        </div>
      </div>

      {weeklyTimetable === undefined ? (
        <Card className="p-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 mb-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Loading your timetable
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            Just a moment…
          </p>
        </Card>
      ) : weeklyTimetable.length === 0 ? (
        <Card className="p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800/60 mb-4">
            <Calendar className="w-6 h-6 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            No timetable entries yet
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 max-w-xs mx-auto">
            {currentUser?.role === "student"
              ? "Your class schedule will appear here once it's configured."
              : "Create timetable entries to get started."}
          </p>
          {isStaff && (
            <Button variant="primary" size="sm" className="mt-5">
              Create Timetable Entry
            </Button>
          )}
        </Card>
      ) : (
        <TimetableGrid
          entries={(weeklyTimetable as TimetableEntry[]).map((entry) => ({
            _id: entry._id,
            courseId: entry.courseId,
            classroomId: entry.classroomId,
            facultyId: entry.facultyId,
            dayOfWeek: entry.dayOfWeek,
            startTime: entry.startTime,
            endTime: entry.endTime,
            course: entry.course,
            classroom: entry.classroom,
            faculty: entry.faculty,
            type: entry.type,
            outline: entry.outline,
            resources: entry.resources,
          }))}
          onEntryClick={(entry) => setSelectedEntry(entry)}
        />
      )}

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold text-slate-900 dark:text-slate-100">
            Weekly Overview
          </h3>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em]">
            At a glance
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-indigo-500/[0.08] to-transparent border border-indigo-500/15 dark:border-indigo-500/20">
            <div className="flex items-center justify-between mb-2.5">
              <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100 leading-none">
              {weeklyTimetable?.length ?? 0}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
              Total Classes
            </p>
          </div>

          <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-teal-500/[0.08] to-transparent border border-teal-500/15 dark:border-teal-500/20">
            <div className="flex items-center justify-between mb-2.5">
              <div className="p-1.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100 leading-none">
              {(weeklyTimetable as TimetableEntry[] | undefined)?.filter((e) => e.dayOfWeek === new Date().getDay()).length ?? 0}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
              Today&apos;s Classes
            </p>
          </div>

          <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-purple-500/[0.08] to-transparent border border-purple-500/15 dark:border-purple-500/20">
            <div className="flex items-center justify-between mb-2.5">
              <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100 leading-none">
              {new Set((weeklyTimetable as TimetableEntry[] | undefined)?.map((e) => e.courseId)).size ?? 0}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
              Unique Courses
            </p>
          </div>

          <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-orange-500/[0.08] to-transparent border border-orange-500/15 dark:border-orange-500/20">
            <div className="flex items-center justify-between mb-2.5">
              <div className="p-1.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100 leading-none">
              {(weeklyTimetable as TimetableEntry[] | undefined)?.filter((e) => e.dayOfWeek >= 1 && e.dayOfWeek <= 5).length ?? 0}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
              Weekday Classes
            </p>
          </div>
        </div>
      </Card>

      <ClassDetailsModal
        isOpen={selectedEntry !== null}
        onClose={() => setSelectedEntry(null)}
        entry={selectedEntry}
      />
    </div>
  );
}
