import { mockAnnouncements } from "@/mocks/announcements";
import { mockBookHubs } from "@/mocks/bookHubs";
import { mockClassStreams } from "@/mocks/classStreams";
import { mockDocuments } from "@/mocks/documents";
import { mockJobs } from "@/mocks/jobs";
import { mockLostAndFound } from "@/mocks/lostAndFound";
import { mockRoommates } from "@/mocks/roommates";
import { mockScholarships } from "@/mocks/scholarships";
import { mockStudyGroups } from "@/mocks/studyGroups";
import { mockTutorials } from "@/mocks/tutorials";
import type {
  Announcement,
  BookHub,
  ClassStream,
  DataSource,
  DocumentItem,
  Job,
  LostAndFoundItem,
  Roommate,
  Scholarship,
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

export function getBookHubs(): BookHub[] {
  return mockBookHubs;
}

export function getAnnouncements(): Announcement[] {
  return mockAnnouncements;
}

export function getLostAndFound(): LostAndFoundItem[] {
  return mockLostAndFound;
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
};