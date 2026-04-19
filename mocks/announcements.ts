import type { Announcement } from "@/lib/data/types";

export const mockAnnouncements: Announcement[] = [
  {
    id: "an-1",
    title: "Mid-term exam timetable released",
    category: "Academic",
    publishedAt: "Today • 10:30 AM",
    summary: "Review the updated mid-term schedule before the end of the day.",
  },
  {
    id: "an-2",
    title: "Hackathon registrations now open",
    category: "Events",
    publishedAt: "Yesterday • 6:00 PM",
    summary: "Team registrations are open until Friday evening.",
  },
];