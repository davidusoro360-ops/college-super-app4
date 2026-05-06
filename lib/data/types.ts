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

export interface BookHubCourseGroup {
  courseId: string;
  courseName: string;
  books: BookHubBook[];
}

export interface BookHubBook {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  hasPdf: boolean;
  pdfUrl?: string;
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

export interface TimetableCourse {
  _id: string;
  name: string;
  code: string;
}

export interface TimetableClassroom {
  _id: string;
  name: string;
  building: string;
}

export interface TimetableFaculty {
  _id: string;
  name: string;
}

export type TimetableClassType = "lecture" | "tutorial" | "lab";

export interface TimetableEntry {
  _id: string;
  courseId: string;
  classroomId: string;
  facultyId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  course?: TimetableCourse | null;
  classroom?: TimetableClassroom | null;
  faculty?: TimetableFaculty | null;
  type?: TimetableClassType;
  outline?: string[];
  resources?: string[];
}

export interface TimetableNextClass extends TimetableEntry {
  isToday: boolean;
  daysUntil?: number;
}

export interface TimetableData {
  weeklyTimetable: TimetableEntry[];
  nextClass: TimetableNextClass | null;
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
  getBookHubs(): BookHubCourseGroup[];
  getAnnouncements(): Announcement[];
  getLostAndFound(): LostAndFoundItem[];
  getCoursemateChats(): CoursemateChat[];
  getFiles(): FileItem[];
  getTimetableData(): TimetableData;
  getStudentDashboardData(): StudentDashboardData;
}