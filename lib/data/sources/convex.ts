import type {
  Announcement,
  BookHub,
  ClassStream,
  CoursemateChat,
  DataSource,
  DocumentItem,
  FileItem,
  Job,
  LostAndFoundItem,
  Roommate,
  Scholarship,
  StudentDashboardData,
  TimetableData,
  StudyGroup,
  Tutorial,
} from "@/lib/data/types";

export function getStudyGroups(): StudyGroup[] {
  return [];
}

export function getRoommates(): Roommate[] {
  return [];
}

export function getClassStreams(): ClassStream[] {
  return [];
}

export function getTutorials(): Tutorial[] {
  return [];
}

export function getJobs(): Job[] {
  return [];
}

export function getDocuments(): DocumentItem[] {
  return [];
}

export function getScholarships(): Scholarship[] {
  return [];
}

export function getBookHubs(): BookHub[] {
  return [];
}

export function getAnnouncements(): Announcement[] {
  return [];
}

export function getLostAndFound(): LostAndFoundItem[] {
  return [];
}

export function getCoursemateChats(): CoursemateChat[] {
  return [];
}

export function getFiles(): FileItem[] {
  return [];
}

export function getTimetableData(): TimetableData {
  return {
    weeklyTimetable: [],
    nextClass: null,
  };
}

export function getStudentDashboardData(): StudentDashboardData {
  return {
    todaySchedule: [],
    attendanceStats: { total: 0, present: 0, absent: 0, late: 0 },
    pendingTickets: [],
    upcomingEvents: [],
    walletBalance: 0,
    walletStatus: "active",
    activeOrders: [],
    borrowedBooks: [],
  };
}

export const convexDataSource: DataSource = {
  getStudyGroups,
  getRoommates,
  getClassStreams,
  getTutorials,
  getJobs,
  getDocuments,
  getScholarships,
  getBookHubs,
  getAnnouncements,
  getLostAndFound,
  getCoursemateChats,
  getFiles,
  getTimetableData,
  getStudentDashboardData,
};