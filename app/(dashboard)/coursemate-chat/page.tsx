"use client";

import { Card } from "@/components/ui/Card";
import { getDataSource, useDevMode } from "@/lib/data";
import { MessageSquare } from "lucide-react";

export default function CoursemateChatPage() {
  const isDevMode = useDevMode();
  const dataSource = getDataSource(isDevMode);
  const chats = dataSource.getCoursemateChats();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Chat with Coursemates
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Message peers from your courses and coordinate on coursework
          </p>
          {isDevMode && (
            <p className="text-xs text-primary-500 dark:text-primary-400 mt-2">
              Mock data enabled
            </p>
          )}
        </div>
      </div>

      {chats.length > 0 ? (
        <div className="space-y-4">
          {chats.map((chat) => (
            <Card key={chat.id} className="p-5">
              <div className="space-y-2">
                <p className="text-sm text-primary-500 dark:text-primary-400">{chat.course}</p>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{chat.name}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">{chat.lastMessage}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {chat.lastMessageAt}
                  {chat.unreadCount > 0 && ` • ${chat.unreadCount} unread`}
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No coursemate chats yet</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Check back later</p>
        </Card>
      )}
    </div>
  );
}
