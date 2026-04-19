"use client";

import { Card } from "@/components/ui/Card";
import { getDataSource, useDevMode } from "@/lib/data";
import { BookMarked } from "lucide-react";

export default function BookHubsPage() {
  const isDevMode = useDevMode();
  const dataSource = getDataSource(isDevMode);
  const bookHubs = dataSource.getBookHubs();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Book Hubs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Share, swap and discover books with fellow students
          </p>
          {isDevMode && (
            <p className="text-xs text-primary-500 dark:text-primary-400 mt-2">
              Mock data enabled
            </p>
          )}
        </div>
      </div>

      {bookHubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookHubs.map((bookHub) => (
            <Card key={bookHub.id} className="p-5">
              <div className="space-y-2">
                <p className="text-sm text-primary-500 dark:text-primary-400 uppercase">{bookHub.type}</p>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{bookHub.title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{bookHub.subject} • {bookHub.condition}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Shared by {bookHub.owner}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <BookMarked className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No book hubs available yet</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Check back later</p>
        </Card>
      )}
    </div>
  );
}
