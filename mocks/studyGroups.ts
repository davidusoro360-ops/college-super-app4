import type { StudyGroup } from "@/lib/data/types";

export const mockStudyGroups: StudyGroup[] = [
  {
    id: "sg-1",
    name: "DSA Night Sprint",
    subject: "Data Structures",
    description: "Solve interview-style problems with peers after class.",
    members: 18,
    meetingTime: "Today • 7:00 PM",
    location: "Library Discussion Hall",
  },
  {
    id: "sg-2",
    name: "Signals Study Circle",
    subject: "Signals & Systems",
    description: "Weekly revision and doubt-clearing for upcoming internals.",
    members: 12,
    meetingTime: "Tomorrow • 5:30 PM",
    location: "ECE Block - Room 204",
  },
];