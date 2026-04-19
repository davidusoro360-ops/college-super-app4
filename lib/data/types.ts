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
}