"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/Card";
import { Calendar, ChevronLeft, MapPin, Loader2 } from "lucide-react";

const isLikelyConvexId = (value: unknown): value is string =>
  typeof value === "string" && /^[a-z0-9]+$/i.test(value) && value.length >= 15;

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const rawId = params?.id;
  const { user, isLoaded } = useUser();

  const canQuery = isLoaded && !!user?.id && isLikelyConvexId(rawId);

  const event = useQuery(
    api.events.getEventById,
    canQuery
      ? { eventId: rawId as Id<"events">, clerkUserId: user!.id }
      : "skip"
  );

  const isLoading = canQuery && event === undefined;
  const notFound = !canQuery || event === null;

  let content;

  if (isLoading) {
    content = (
      <Card className="p-8 text-center">
        <Loader2 className="w-6 h-6 text-slate-400 mx-auto mb-3 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400">Loading event…</p>
      </Card>
    );
  } else if (notFound || !event) {
    content = (
      <Card className="p-8 text-center">
        <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <p className="text-slate-500 dark:text-slate-400">Event not found</p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 break-all">
          ID: {rawId ?? "unknown"}
        </p>
      </Card>
    );
  } else {
    content = (
        <Card className="p-6">
          <div className="space-y-3">
            <p className="text-sm text-primary-500 dark:text-primary-400 capitalize">
              {event.type}
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {event.title}
            </h1>
            {event.location && (
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.location}
              </p>
            )}
            <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
              {event.description}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 break-all pt-2">
              ID: {event._id}
            </p>
          </div>
        </Card>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Events
        </Link>
      </div>

      {content}
    </div>
  );
}
