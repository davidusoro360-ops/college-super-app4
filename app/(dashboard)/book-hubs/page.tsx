"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/Card";
import { BookMarked, ExternalLink, Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function BookHubsPage() {
  const { user, isLoaded } = useUser();

  const data = useQuery(
    api.bookhub.getBookHubData,
    isLoaded && user?.id ? { clerkUserId: user.id } : "skip"
  );

  useEffect(() => {
    console.log("BookHub data:", data);
  }, [data]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Book Hubs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Recommended books from your semester timetable
          </p>
        </div>
      </div>

      {data === undefined ? (
        <Card className="p-8 text-center">
          <Loader2 className="w-8 h-8 text-slate-400 mx-auto mb-3 animate-spin" />
          <p className="text-slate-500 dark:text-slate-400">Loading book recommendations…</p>
        </Card>
      ) : data.length > 0 ? (
        <div className="space-y-6">
          {data.map((group) => (
            <section key={group.course._id} className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {group.course.code} — {group.course.name}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {group.books.length} recommended {group.books.length === 1 ? "book" : "books"}
                </p>
              </div>

              {group.books.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {group.books.map((book) => (
                    <Card key={book._id} className="overflow-hidden">
                      <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800">
                        {book.coverUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={book.coverUrl}
                            alt={book.title || "Book cover"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <BookMarked className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                          </div>
                        )}
                      </div>

                      <div className="p-5 space-y-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            {book.title || "Untitled book"}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {book.author || "Unknown author"}
                          </p>
                        </div>

                        {book.hasPdf && book.pdfUrl ? (
                          <a
                            href={book.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            PDF available
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="inline-flex text-sm text-slate-400 dark:text-slate-500">
                            No PDF available
                          </span>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-5">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No books have been linked to this course yet.
                  </p>
                </Card>
              )}
            </section>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <BookMarked className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No BookHub recommendations available yet</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Add timetable courses, link library books to those courses, then attach PDF resources to books.
          </p>
        </Card>
      )}
    </div>
  );
}
