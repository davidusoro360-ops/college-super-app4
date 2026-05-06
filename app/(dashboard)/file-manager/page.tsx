"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { UploadResourceModal } from "@/components/modals/UploadResourceModal";
import {
  Clock,
  Download,
  ExternalLink,
  File,
  FileText,
  Filter,
  FolderOpen,
  Image,
  Link as LinkIcon,
  Loader2,
  Search,
  Upload,
  Video,
} from "lucide-react";

type ResourceType = "document" | "video" | "link" | "image" | "other";
type ViewMode = "all" | "mine";

interface FileResource {
  _id: string;
  title: string;
  description?: string;
  type: ResourceType;
  url: string;
  fileType?: string;
  uploadedBy: string;
  tags?: string[];
  downloadCount?: number;
  createdAt: number;
}

const typeFilters: { type: ResourceType | null; icon: React.ElementType; label: string }[] = [
  { type: null, icon: Filter, label: "All" },
  { type: "document", icon: FileText, label: "Docs" },
  { type: "video", icon: Video, label: "Videos" },
  { type: "link", icon: LinkIcon, label: "Links" },
  { type: "image", icon: Image, label: "Images" },
  { type: "other", icon: File, label: "Other" },
];

export default function FileManagerPage() {
  const { user, isLoaded } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ResourceType | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const currentUser = useQuery(
    api.users.getUser,
    isLoaded && user?.id ? { clerkUserId: user.id } : "skip"
  );

  const resources = useQuery(
    api.resources.getByCollege,
    isLoaded && user?.id && currentUser?.collegeId
      ? { clerkUserId: user.id, collegeId: currentUser.collegeId }
      : "skip"
  );

  const myUploads = useQuery(
    api.resources.getMyUploads,
    isLoaded && user?.id ? { clerkUserId: user.id } : "skip"
  );

  const incrementDownload = useMutation(api.resources.incrementDownload);

  const activeFiles = (viewMode === "mine"
    ? myUploads
    : currentUser?.collegeId
      ? resources
      : []) as FileResource[] | undefined;
  const filteredFiles = activeFiles?.filter((file) => {
    const normalizedSearch = searchQuery.toLowerCase();
    const matchesSearch = searchQuery
      ? file.title.toLowerCase().includes(normalizedSearch) ||
        file.description?.toLowerCase().includes(normalizedSearch) ||
        file.tags?.some((tag) => tag.toLowerCase().includes(normalizedSearch)) ||
        file.fileType?.toLowerCase().includes(normalizedSearch)
      : true;
    const matchesType = selectedType ? file.type === selectedType : true;

    return matchesSearch && matchesType;
  });

  const handleOpen = async (file: FileResource) => {
    if (user?.id) {
      await incrementDownload({
        clerkUserId: user.id,
        resourceId: file._id as Id<"resources">,
      });
    }
    window.open(file.url, "_blank", "noopener,noreferrer");
  };

  const getTypeCount = (type: ResourceType | null) => {
    const files = activeFiles ?? [];
    if (!type) return files.length;
    return files.filter((file) => file.type === type).length;
  };

  const isWaitingForUserRecord = isLoaded && !!user?.id && currentUser === undefined;
  const isWaitingForFiles =
    viewMode === "mine"
      ? !!user?.id && myUploads === undefined
      : !!currentUser?.collegeId && resources === undefined;
  const isLoading = !isLoaded || isWaitingForUserRecord || isWaitingForFiles;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            File Manager
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Organize and share your academic files in one place
          </p>
        </div>

        {currentUser?.collegeId && user?.id && (
          <Button variant="primary" onClick={() => setShowUploadModal(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: "all" as const, label: "All Files" },
          { id: "mine" as const, label: "My Uploads" },
        ].map((view) => (
          <button
            key={view.id}
            type="button"
            onClick={() => setViewMode(view.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === view.id
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {typeFilters.map(({ type, icon: Icon, label }) => (
          <button
            key={label}
            type="button"
            onClick={() => setSelectedType(type)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
              selectedType === type
                ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Icon className="w-5 h-5" />
            <div className="text-left">
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs opacity-70">{getTypeCount(type)}</p>
            </div>
          </button>
        ))}
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search files by title, description, tag, or file type..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </Card>

      {isLoading ? (
        <Card className="p-8 text-center">
          <Loader2 className="w-8 h-8 text-slate-400 mx-auto mb-3 animate-spin" />
          <p className="text-slate-500 dark:text-slate-400">Loading files…</p>
        </Card>
      ) : filteredFiles && filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredFiles.map((file) => (
            <FileCard key={file._id} file={file} onOpen={() => handleOpen(file)} />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <FolderOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No files found</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            {searchQuery || selectedType
              ? "Try adjusting your search or filters"
              : viewMode === "mine"
                ? "Upload a resource to see it here"
                : "Files uploaded in Resources will appear here"}
          </p>
          {currentUser?.collegeId && user?.id && (
            <Button variant="primary" className="mt-4" onClick={() => setShowUploadModal(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
          )}
        </Card>
      )}

      {currentUser?.collegeId && user?.id && (
        <UploadResourceModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          collegeId={currentUser.collegeId}
          clerkUserId={user.id}
          onSuccess={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
}

function FileCard({ file, onOpen }: { file: FileResource; onOpen: () => void }) {
  const Icon = getFileIcon(file.type);
  const fileType = file.fileType || file.type;

  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="shrink-0 p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
          <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase">
                {fileType}
              </p>
              <Link href={`/file-manager/${file._id}`} className="block">
                <h2 className="font-semibold text-slate-900 dark:text-slate-100 truncate hover:text-indigo-600 dark:hover:text-indigo-400">
                  {file.title}
                </h2>
              </Link>
            </div>
          </div>

          {file.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {file.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(file.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {file.downloadCount ?? 0} downloads
            </span>
          </div>

          {file.tags && file.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {file.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <Button variant="primary" size="sm" className="w-full mt-4" onClick={onOpen}>
            <ExternalLink className="w-4 h-4 mr-1" />
            {file.type === "link" ? "Open Link" : "Open File"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function getFileIcon(type: ResourceType) {
  const icons = {
    document: FileText,
    video: Video,
    link: LinkIcon,
    image: Image,
    other: File,
  };
  return icons[type];
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
