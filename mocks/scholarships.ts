import type { Scholarship } from "@/lib/data/types";

export const mockScholarships: Scholarship[] = [
  {
    id: "sch-1",
    title: "Merit Excellence Grant",
    provider: "SRKR Alumni Trust",
    amount: "₹25,000",
    deadline: "28 Apr 2026",
    eligibility: "CGPA 8.5+",
  },
  {
    id: "sch-2",
    title: "Women in STEM Support Fund",
    provider: "Innovation Council",
    amount: "₹15,000",
    deadline: "05 May 2026",
    eligibility: "Open to 2nd-4th year students",
  },
];