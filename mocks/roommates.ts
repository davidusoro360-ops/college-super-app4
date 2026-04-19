import type { Roommate } from "@/lib/data/types";

export const mockRoommates: Roommate[] = [
  {
    id: "rm-1",
    name: "Akhil Varma",
    branch: "CSE",
    year: 3,
    preferences: ["Non-smoker", "Early riser", "Quiet room"],
    budget: "₹6,000 / month",
    location: "Bhimavaram",
  },
  {
    id: "rm-2",
    name: "Nisha Reddy",
    branch: "ECE",
    year: 2,
    preferences: ["Shared study setup", "Weekend cooking"],
    budget: "₹7,500 / month",
    location: "Hostel Annex",
  },
];