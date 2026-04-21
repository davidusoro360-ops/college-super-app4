import type { StudentDashboardData } from "@/lib/data/types";

const now = Date.now();
const dayMs = 24 * 60 * 60 * 1000;

export const mockStudentDashboard: StudentDashboardData = {
  todaySchedule: [
    {
      startTime: "09:00",
      endTime: "10:00",
      isOngoing: false,
      isCompleted: true,
      course: { name: "Data Structures", code: "CS201" },
      classroom: { name: "Room 201" },
    },
    {
      startTime: "10:15",
      endTime: "11:15",
      isOngoing: true,
      isCompleted: false,
      course: { name: "Computer Networks", code: "CS305" },
      classroom: { name: "Lab B" },
    },
    {
      startTime: "11:30",
      endTime: "12:30",
      isOngoing: false,
      isCompleted: false,
      course: { name: "Engineering Mathematics - III", code: "MA301" },
      classroom: { name: "Room 105" },
    },
    {
      startTime: "14:00",
      endTime: "15:00",
      isOngoing: false,
      isCompleted: false,
      course: { name: "Operating Systems", code: "CS304" },
      classroom: { name: "Room 302" },
    },
  ],
  attendanceStats: {
    total: 4,
    present: 3,
    absent: 1,
    late: 0,
  },
  pendingTickets: [
    {
      _id: "mock-ticket-1",
      title: "Wi-Fi disconnecting in Hostel Block C",
      category: "hostel",
      priority: "medium",
      status: "open",
    },
    {
      _id: "mock-ticket-2",
      title: "Request projector replacement in Room 201",
      category: "academic",
      priority: "low",
      status: "in_progress",
    },
  ],
  upcomingEvents: [
    {
      _id: "mock-event-1",
      title: "Tech Fest 2026 - Hackathon",
      startTime: now + 2 * dayMs,
      type: "technical",
      location: "Main Auditorium",
    },
    {
      _id: "mock-event-2",
      title: "Alumni Meet & Career Panel",
      startTime: now + 5 * dayMs,
      type: "cultural",
      location: "Seminar Hall",
    },
    {
      _id: "mock-event-3",
      title: "Inter-College Cricket Tournament",
      startTime: now + 9 * dayMs,
      type: "sports",
      location: "Sports Ground",
    },
  ],
  walletBalance: 1250,
  walletStatus: "active",
  activeOrders: [{ _id: "mock-order-1" }],
  borrowedBooks: [{ _id: "mock-borrow-1" }, { _id: "mock-borrow-2" }],
};
