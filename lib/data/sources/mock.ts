import { mockAnnouncements } from "@/mocks/announcements";
import { getBookHubs as getMockBookHubs } from "@/mocks/bookHubs";
import { mockClassStreams } from "@/mocks/classStreams";
import { mockCoursemateChats } from "@/mocks/coursemateChats";
import { mockDocuments } from "@/mocks/documents";
import { mockFiles } from "@/mocks/files";
import { mockJobs } from "@/mocks/jobs";
import { mockLostAndFound } from "@/mocks/lostAndFound";
import { mockRoommates } from "@/mocks/roommates";
import { mockScholarships } from "@/mocks/scholarships";
import { mockStudentDashboard } from "@/mocks/studentDashboard";
import { getMockTimetableData } from "@/mocks/timetable";
import { mockStudyGroups } from "@/mocks/studyGroups";
import { mockTutorials } from "@/mocks/tutorials";
import type {
  Announcement,
  BookHubCourseGroup,
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
  return mockStudyGroups;
}

export function getRoommates(): Roommate[] {
  return mockRoommates;
}

export function getClassStreams(): ClassStream[] {
  return mockClassStreams;
}

export function getTutorials(): Tutorial[] {
  return mockTutorials;
}

export function getJobs(): Job[] {
  return mockJobs;
}

export function getDocuments(): DocumentItem[] {
  return mockDocuments;
}

export function getScholarships(): Scholarship[] {
  return mockScholarships;
}

export function getBookHubs(): BookHubCourseGroup[] {
  return getMockBookHubs();
}

export function getAnnouncements(): Announcement[] {
  return mockAnnouncements;
}

export function getLostAndFound(): LostAndFoundItem[] {
  return mockLostAndFound;
}

export function getCoursemateChats(): CoursemateChat[] {
  return mockCoursemateChats;
}

export function getFiles(): FileItem[] {
  return mockFiles;
}

export function getTimetableData(): TimetableData {
  return getMockTimetableData();
}

export function getStudentDashboardData(): StudentDashboardData {
  return mockStudentDashboard;
}

export const mockDataSource: DataSource = {
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