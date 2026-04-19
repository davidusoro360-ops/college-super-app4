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
};