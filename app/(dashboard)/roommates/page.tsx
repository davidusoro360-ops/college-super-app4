"use client";

import { Card } from "@/components/ui/Card";
import { getDataSource, useDevMode } from "@/lib/data";
import { UserSearch } from "lucide-react";

export default function RoommatesPage() {
  const isDevMode = useDevMode();
  const dataSource = getDataSource(isDevMode);
  const roommates = dataSource.getRoommates();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Find Roommates
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Discover compatible roommates on and around campus
          </p>
          {isDevMode && (
            <p className="text-xs text-primary-500 dark:text-primary-400 mt-2">
              Mock data enabled
            </p>
          )}
        </div>
      </div>

      {roommates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roommates.map((roommate) => (
            <Card key={roommate.id} className="p-5">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{roommate.name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{roommate.branch} • Year {roommate.year}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{roommate.budget} • {roommate.location}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{roommate.preferences.join(" • ")}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <UserSearch className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No roommate listings available yet</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Check back later</p>
        </Card>
      )}
    </div>
  );
}
