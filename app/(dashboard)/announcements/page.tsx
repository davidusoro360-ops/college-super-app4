"use client";

import { Card } from "@/components/ui/Card";
import { getDataSource, useDevMode } from "@/lib/data";
import { Megaphone } from "lucide-react";

export default function AnnouncementsPage() {
  const isDevMode = useDevMode();
  const dataSource = getDataSource(isDevMode);
  const announcements = dataSource.getAnnouncements();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Announcements
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Stay updated with the latest campus announcements
          </p>
          {isDevMode && (
            <p className="text-xs text-primary-500 dark:text-primary-400 mt-2">
              Mock data enabled
            </p>
          )}
        </div>
      </div>

      {announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="p-5">
              <div className="space-y-2">
                <p className="text-sm text-primary-500 dark:text-primary-400">{announcement.category}</p>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{announcement.title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{announcement.publishedAt}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{announcement.summary}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Megaphone className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No announcements available yet</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Check back later</p>
        </Card>
      )}
    </div>
  );
}
