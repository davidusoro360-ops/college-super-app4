import type { CoursemateChat } from "@/lib/data/types";

export const mockCoursemateChats: CoursemateChat[] = [
  {
    id: "cm-1",
    name: "Ananya Patel",
    course: "CS402 - Operating Systems",
    lastMessage: "Sharing my notes from today's lecture, check them out.",
    lastMessageAt: "Today • 2:15 PM",
    unreadCount: 3,
  },
  {
    id: "cm-2",
    name: "Ravi Teja",
    course: "EC210 - Digital Logic",
    lastMessage: "Are we meeting in the lab before the quiz?",
    lastMessageAt: "Yesterday • 8:40 PM",
    unreadCount: 0,
  },
];
