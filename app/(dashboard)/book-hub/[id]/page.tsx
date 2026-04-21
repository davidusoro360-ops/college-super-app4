"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ChevronLeft } from "lucide-react";

export default function BookHubDetailPage() {
  const params = useParams<{ id: string }>();
  const rawId = params?.id;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/book-hub"
          className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Book Hub
        </h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 break-all">
          ID: {rawId ?? "unknown"}
        </p>
      </div>

      <Card className="p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">
          This is a preview page. Data integration not yet implemented.
        </p>
      </Card>
    </div>
  );
}
