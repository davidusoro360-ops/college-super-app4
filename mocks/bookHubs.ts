import type { BookHub } from "@/lib/data/types";

export const mockBookHubs: BookHub[] = [
  {
    id: "bh-1",
    title: "Engineering Mathematics - III",
    owner: "Ravi Teja",
    subject: "Mathematics",
    condition: "Like new",
    type: "lend",
  },
  {
    id: "bh-2",
    title: "Computer Networks Handbook",
    owner: "Sneha Polisetty",
    subject: "Computer Science",
    condition: "Good",
    type: "swap",
  },
];