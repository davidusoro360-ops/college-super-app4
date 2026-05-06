"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/Card";
import { UniversalSearch } from "@/components/search/UniversalSearch";
import { 
  TrendingUp, 
  Calendar, 
  Ticket,
  Clock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  const { user } = useUser();

  const currentUser = useQuery(
    api.users.getUser,
    user?.id ? { clerkUserId: user.id } : "skip"
  );

  const upcomingEvents = useQuery(
    api.events.getUpcoming,
    currentUser?.collegeId
      ? { collegeId: currentUser.collegeId, clerkUserId: user!.id, limit: 3 }
      : "skip"
  );

  if (!user || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const quickLinks = [
    {
      icon: Calendar,
      label: "Events",
      href: "/events",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: Ticket,
      label: "Tickets",
      href: "/tickets",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Search
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Find events and tickets across the platform
        </p>
      </div>

      <Card className="p-6">
        <UniversalSearch
          collegeId={currentUser.collegeId}
          clerkUserId={user.id}
        />
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Quick Links
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl ${link.bgColor} hover:opacity-80 transition-opacity`}
              >
                <Icon className={`w-6 h-6 ${link.color}`} />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {upcomingEvents && upcomingEvents.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Upcoming Events
              </h2>
            </div>
            <Link
              href="/events"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <Link
                key={event._id}
                href={`/events/${event._id}`}
                className="block"
              >
                <Card className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-slate-100">
                        {event.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {event.location}
                      </p>
                    </div>
                    <div className="text-right text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(event.startTime)}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
