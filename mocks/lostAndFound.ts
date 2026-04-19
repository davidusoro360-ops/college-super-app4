import type { LostAndFoundItem } from "@/lib/data/types";

export const mockLostAndFound: LostAndFoundItem[] = [
  {
    id: "lf-1",
    itemName: "Blue Water Bottle",
    type: "found",
    location: "CSE Block - Lab 3",
    reportedAt: "Today • 9:15 AM",
    status: "Awaiting claim",
  },
  {
    id: "lf-2",
    itemName: "ID Card - K. Harini",
    type: "lost",
    location: "Main Canteen",
    reportedAt: "Yesterday • 1:40 PM",
    status: "Reported",
  },
];