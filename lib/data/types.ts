export interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string;
  members: number;
  meetingTime: string;
  location: string;
}

export interface Roommate {
  id: string;
  name: string;
  branch: string;
  year: number;
  preferences: string[];
  budget: string;
  location: string;
}

export interface ClassStream {
  id: string;
  title: string;
  courseCode: string;
  instructor: string;
  startsAt: string;
  mode: "live" | "recorded";
  duration: string;
}

export interface Tutorial {
  id: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  author: string;
  duration: string;
}

export interface Job {
  id: string;
  title: string;
  type: string;
  company: string;
  location: string;
  stipend: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  status: "pending" | "review" | "signed";
  requestedBy: string;
  dueDate: string;
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  eligibility: string;
}

export interface BookHub {
  id: string;
  title: string;
  owner: string;
  subject: string;
  condition: string;
  type: "swap" | "lend" | "sell";
}

export interface Announcement {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  summary: string;
}

export interface LostAndFoundItem {
  id: string;
  itemName: string;
  type: "lost" | "found";
  location: string;
  reportedAt: string;
  status: string;
}

export interface CoursemateChat {
  id: string;
  name: string;
  course: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  updatedAt: string;
  owner: string;
}

export interface StudentDashboardScheduleSlot {
  startTime: string;
  endTime: string;
  isOngoing: boolean;
  isCompleted: boolean;
  course: { name: string; code: string } | null;
  classroom: { name: string } | null;
}

export interface StudentDashboardTicket {
  _id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
}

export interface StudentDashboardEvent {
  _id: string;
  title: string;
  startTime: number;
  type: string;
  location?: string;
}

export interface StudentDashboardAttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
}

export interface StudentDashboardOrder {
  _id: string;
}

export interface StudentDashboardBorrow {
  _id: string;
}

export interface StudentDashboardData {
  todaySchedule: StudentDashboardScheduleSlot[];
  attendanceStats: StudentDashboardAttendanceStats;
  pendingTickets: StudentDashboardTicket[];
  upcomingEvents: StudentDashboardEvent[];
  walletBalance: number;
  walletStatus: string;
  activeOrders: StudentDashboardOrder[];
  borrowedBooks: StudentDashboardBorrow[];
}

export interface DataSource {
  getStudyGroups(): StudyGroup[];
  getRoommates(): Roommate[];
  getClassStreams(): ClassStream[];
  getTutorials(): Tutorial[];
  getJobs(): Job[];
  getDocuments(): DocumentItem[];
  getScholarships(): Scholarship[];
  getBookHubs(): BookHub[];
  getAnnouncements(): Announcement[];
  getLostAndFound(): LostAndFoundItem[];
  getCoursemateChats(): CoursemateChat[];
  getFiles(): FileItem[];
  getStudentDashboardData(): StudentDashboardData;
}