"use client";

import { useSyncExternalStore } from "react";
import { convexDataSource } from "@/lib/data/sources/convex";
import { mockDataSource } from "@/lib/data/sources/mock";

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
  StudyGroup,
  Tutorial,
} from "@/lib/data/types";