"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { convexDataSource } from "@/lib/data/sources/convex";
import { mockDataSource } from "@/lib/data/sources/mock";
import type { StudentDashboardData, TimetableData } from "@/lib/data/types";

const DEV_MODE_KEY = "DEV_MODE";
const DEV_MODE_EVENT = "dev-mode-change";

export function getDevMode() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(DEV_MODE_KEY) === "true";
}

export function setDevMode(enabled: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DEV_MODE_KEY, String(enabled));
  window.dispatchEvent(new Event(DEV_MODE_EVENT));
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = () => callback();

  window.addEventListener(DEV_MODE_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(DEV_MODE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function useDevMode() {
  return useSyncExternalStore(subscribe, getDevMode, () => false);
}

export function getDataSource(devMode = getDevMode()) {
  return devMode ? mockDataSource : convexDataSource;
}

export interface UseStudentDashboardDataArgs {
  clerkUserId?: string;
  collegeId?: Id<"colleges">;
}

export interface UseTimetableDataArgs {
  clerkUserId?: string;
  collegeId?: Id<"colleges">;
  ready?: boolean;
}

export function useTimetableData(
  args: UseTimetableDataArgs | null
): TimetableData | undefined {
  const isDevMode = useDevMode();

  const shouldLoadNextClass = !isDevMode && !!args?.clerkUserId && args?.ready !== false;
  const shouldLoadWeeklyTimetable = shouldLoadNextClass && !!args?.collegeId;

  const convexWeeklyTimetable = useQuery(
    api.timetable.getWeeklyTimetable,
    shouldLoadWeeklyTimetable && args?.clerkUserId && args?.collegeId
      ? { clerkUserId: args.clerkUserId, collegeId: args.collegeId }
      : "skip"
  );

  const convexNextClass = useQuery(
    api.timetable.getNextClass,
    shouldLoadNextClass && args?.clerkUserId
      ? { clerkUserId: args.clerkUserId }
      : "skip"
  );

  const mockData = useMemo(
    () => (isDevMode ? mockDataSource.getTimetableData() : undefined),
    [isDevMode]
  );

  if (isDevMode) {
    return mockData;
  }

  if (!args?.clerkUserId || args.ready === false || !shouldLoadWeeklyTimetable) {
    return undefined;
  }

  if (convexWeeklyTimetable === undefined || convexNextClass === undefined) {
    return undefined;
  }

  return {
    weeklyTimetable: convexWeeklyTimetable,
    nextClass: convexNextClass as TimetableData["nextClass"],
  };
}

export function useStudentDashboardData(
  args: UseStudentDashboardDataArgs | null
): StudentDashboardData | undefined {
  const isDevMode = useDevMode();

  const convexData = useQuery(
    api.dashboard.getStudentDashboard,
    !isDevMode && args?.clerkUserId && args?.collegeId
      ? { clerkUserId: args.clerkUserId, collegeId: args.collegeId }
      : "skip"
  );

  const mockData = useMemo(
    () => (isDevMode ? mockDataSource.getStudentDashboardData() : undefined),
    [isDevMode]
  );

  if (isDevMode) {
    return mockData;
  }

  return convexData as StudentDashboardData | undefined;
}

export type {
  Announcement,
  BookHub,
  ClassStream,
  CoursemateChat,
  DataSource,
  DocumentItem,
  FileItem,
  Job,
  LostAndFoundItem,
  Roommate,
  Scholarship,
  StudentDashboardData,
  TimetableData,
  TimetableEntry,
  TimetableNextClass,
  StudyGroup,
  Tutorial,
} from "@/lib/data/types";