"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, Download, ExternalLink, FileText, Loader2 } from "lucide-react";

const isLikelyConvexId = (value: unknown): value is string =>
  typeof value === "string" && /^[a-z0-9]+$/i.test(value) && value.length >= 15;

export default function FileManagerDetailPage() {
  const params = useParams<{ id: string }>();
  const rawId = params?.id;
  const { user, isLoaded } = useUser();

  const canQuery = isLoaded && !!user?.id && isLikelyConvexId(rawId);

  const resource = useQuery(
    api.resources.getById,
    canQuery
      ? { resourceId: rawId as Id<"resources">, clerkUserId: user!.id }
      : "skip"
  );

  const incrementDownload = useMutation(api.resources.incrementDownload);
  const isLoading = canQuery && resource === undefined;
  const notFound = !canQuery || resource === null || resource?.status === "deleted";

  const handleOpen = async () => {
    if (!resource || !user?.id) return;

    await incrementDownload({
      clerkUserId: user.id,
      resourceId: resource._id,
    });
    window.open(resource.url, "_blank", "noopener,noreferrer");
  };

  let content;

  if (isLoading) {
    content = (
      <Card className="p-8 text-center">
        <Loader2 className="w-6 h-6 text-slate-400 mx-auto mb-3 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400">Loading file…</p>
      </Card>
    );
  } else if (notFound || !resource) {
    content = (
      <Card className="p-8 text-center">
        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <p className="text-slate-500 dark:text-slate-400">File not found</p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 break-all">
          ID: {rawId ?? "unknown"}
        </p>
      </Card>
    );
  } else {
    content = (
      <Card className="p-6">
        <div className="space-y-5">
          <div>
            <p className="text-sm text-primary-500 dark:text-primary-400 capitalize">
              {resource.fileType || resource.type}
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {resource.title}
            </h1>
            {resource.description && (
              <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap mt-3">
                {resource.description}
              </p>
            )}
          </div>

          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary" onClick={handleOpen}>
              {resource.type === "link" ? (
                <ExternalLink className="w-4 h-4 mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {resource.type === "link" ? "Open Link" : "Open File"}
            </Button>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 break-all pt-2">
            ID: {resource._id}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/file-manager"
          className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      {content}
    </div>
  );
}
