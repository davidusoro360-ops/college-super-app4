"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import type { ElementType, ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ResourceCard } from "@/components/features/ResourceCard";
import { UploadResourceModal } from "@/components/modals/UploadResourceModal";
import { 
  Search, 
  Filter, 
  Upload, 
  FileText, 
  Video, 
  Link, 
  Image,
  File,
  BookMarked,
  ExternalLink,
  TrendingUp,
  Clock,
  BookOpen,
  Loader2
} from "lucide-react";

type ResourceType = "document" | "video" | "link" | "image" | "other";
type ViewMode = "all" | "courses";
type MaterialFilter = "all" | "documents" | "videos" | "books";

interface Resource {
  _id: string;
  title: string;
  description?: string;
  type: ResourceType;
  url: string;
  uploadedBy: string;
  tags?: string[];
  downloadCount?: number;
  createdAt: number;
}

interface CourseMaterialResource {
  _id: string;
  title: string;
  description?: string;
  type: ResourceType;
  url: string;
  createdAt: number;
}

export default function ResourcesPage() {
  const { user, isLoaded } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ResourceType | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [materialFilter, setMaterialFilter] = useState<MaterialFilter>("all");

  const currentUser = useQuery(
    api.users.getUser,
    user?.id ? { clerkUserId: user.id } : "skip"
  );

  const resources = useQuery(
    api.resources.getByCollege,
    currentUser?.collegeId
      ? { clerkUserId: user!.id, collegeId: currentUser.collegeId }
      : "skip"
  );

  const popularResources = useQuery(
    api.resources.getPopular,
    currentUser?.collegeId
      ? { clerkUserId: user!.id, collegeId: currentUser.collegeId, limit: 5 }
      : "skip"
  );

  const myUploads = useQuery(
    api.resources.getMyUploads,
    user?.id ? { clerkUserId: user.id } : "skip"
  );

  const courseMaterials = useQuery(
    api.courseMaterials.getCourseMaterialsForStudent,
    viewMode === "courses" && isLoaded && user?.id
      ? { clerkUserId: user.id }
      : "skip"
  );

  const incrementDownload = useMutation(api.resources.incrementDownload);

  const typeFilters: { type: ResourceType | null; icon: ElementType; label: string }[] = [
    { type: null, icon: Filter, label: "All" },
    { type: "document", icon: FileText, label: "Documents" },
    { type: "video", icon: Video, label: "Videos" },
    { type: "link", icon: Link, label: "Links" },
    { type: "image", icon: Image, label: "Images" },
    { type: "other", icon: File, label: "Other" },
  ];

  const filteredResources = (resources as Resource[] | undefined)?.filter((resource) => {
    const matchesSearch = searchQuery
      ? resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    const matchesType = selectedType ? resource.type === selectedType : true;
    return matchesSearch && matchesType;
  });

  const handleDownload = async (resourceId: string) => {
    await incrementDownload({ clerkUserId: user!.id, resourceId: resourceId as Id<"resources"> });
  };

  const getTypeCount = (type: ResourceType | null) => {
    if (!resources) return 0;
    if (!type) return resources.length;
    return (resources as Resource[]).filter((r: Resource) => r.type === type).length;
  };

  const hasCourseMaterials = courseMaterials?.some(
    (group) =>
      group.books.length > 0 ||
      group.resources.documents.length > 0 ||
      group.resources.videos.length > 0 ||
      group.resources.links.length > 0
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Resources
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Access and share study materials, notes, and resources
          </p>
        </div>

        <Button variant="primary" onClick={() => setShowUploadModal(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Resource
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: "all" as const, label: "All Resources" },
          { id: "courses" as const, label: "Course Materials" },
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

      {viewMode === "courses" ? (
        <CourseMaterialsView
          courseMaterials={courseMaterials}
          hasCourseMaterials={Boolean(hasCourseMaterials)}
          materialFilter={materialFilter}
          setMaterialFilter={setMaterialFilter}
        />
      ) : (
        <>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {typeFilters.map(({ type, icon: Icon, label }) => (
          <button
            key={label}
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search resources by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </Card>

      {popularResources && popularResources.length > 0 && !searchQuery && !selectedType && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Popular Resources
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(popularResources as Resource[]).map((resource) => (
              <ResourceCard
                key={resource._id}
                title={resource.title}
                description={resource.description}
                type={resource.type}
                url={resource.url}
                tags={resource.tags}
                downloadCount={resource.downloadCount}
                createdAt={resource.createdAt}
                isOwner={resource.uploadedBy === currentUser?._id}
                onDownload={() => handleDownload(resource._id)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {selectedType 
              ? `${typeFilters.find((f) => f.type === selectedType)?.label}` 
              : "All Resources"}
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {filteredResources?.length ?? 0} resources
          </span>
        </div>

        {filteredResources && filteredResources.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(filteredResources as Resource[]).map((resource) => (
              <ResourceCard
                key={resource._id}
                title={resource.title}
                description={resource.description}
                type={resource.type}
                url={resource.url}
                tags={resource.tags}
                downloadCount={resource.downloadCount}
                createdAt={resource.createdAt}
                isOwner={resource.uploadedBy === currentUser?._id}
                onDownload={() => handleDownload(resource._id)}
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">
              No resources found
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              {searchQuery || selectedType
                ? "Try adjusting your search or filters"
                : "Be the first to upload a resource!"}
            </p>
            <Button variant="primary" className="mt-4" onClick={() => setShowUploadModal(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Resource
            </Button>
          </Card>
        )}
      </div>

      {myUploads && myUploads.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Your Uploads
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(myUploads as Resource[]).slice(0, 4).map((resource) => (
              <ResourceCard
                key={resource._id}
                title={resource.title}
                description={resource.description}
                type={resource.type}
                url={resource.url}
                tags={resource.tags}
                downloadCount={resource.downloadCount}
                createdAt={resource.createdAt}
                isOwner={true}
                canEdit={true}
                onDownload={() => handleDownload(resource._id)}
              />
            ))}
          </div>
        </div>
      )}
        </>
      )}

      {currentUser?.collegeId && (
        <UploadResourceModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          collegeId={currentUser.collegeId}
          clerkUserId={user!.id}
          onSuccess={() => {
            setShowUploadModal(false);
          }}
        />
      )}
    </div>
  );
}

function CourseMaterialsView({
  courseMaterials,
  hasCourseMaterials,
  materialFilter,
  setMaterialFilter,
}: {
  courseMaterials:
    | Array<{
        courseId: string;
        courseName: string;
        courseCode?: string;
        books: Array<{ _id: string; title: string; author: string; coverUrl?: string }>;
        resources: {
          documents: CourseMaterialResource[];
          videos: CourseMaterialResource[];
          links: CourseMaterialResource[];
        };
      }>
    | undefined;
  hasCourseMaterials: boolean;
  materialFilter: MaterialFilter;
  setMaterialFilter: (filter: MaterialFilter) => void;
}) {
  const materialTabs: { id: MaterialFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "documents", label: "Documents" },
    { id: "videos", label: "Videos" },
    { id: "books", label: "Books" },
  ];

  if (courseMaterials === undefined) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="w-8 h-8 text-slate-400 mx-auto mb-3 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400">Loading course materials…</p>
      </Card>
    );
  }

  if (!courseMaterials.length || !hasCourseMaterials) {
    return (
      <Card className="p-8 text-center">
        <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <p className="text-slate-500 dark:text-slate-400">No course materials available</p>
      </Card>
    );
  }

  const visibleGroups = courseMaterials.filter((group) => {
    if (materialFilter === "books") return group.books.length > 0;
    if (materialFilter === "documents") return group.resources.documents.length > 0;
    if (materialFilter === "videos") return group.resources.videos.length > 0;

    return (
      group.books.length > 0 ||
      group.resources.documents.length > 0 ||
      group.resources.videos.length > 0 ||
      group.resources.links.length > 0
    );
  });

  const activeMaterialLabel =
    materialTabs.find((tab) => tab.id === materialFilter)?.label ?? "selected";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {materialTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMaterialFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              materialFilter === tab.id
                ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {visibleGroups.length === 0 ? (
        <Card className="p-8 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">
            No {activeMaterialLabel.toLowerCase()} materials available
          </p>
        </Card>
      ) : visibleGroups.map((group) => (
        <Card key={group.courseId} className="p-5 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {group.courseCode ? `${group.courseCode} — ` : ""}{group.courseName}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {group.books.length} books • {group.resources.documents.length} documents • {group.resources.videos.length} videos • {group.resources.links.length} links
            </p>
          </div>

          {(materialFilter === "all" || materialFilter === "books") && group.books.length > 0 && (
            <section className="space-y-3">
              <SectionTitle icon={<BookOpen className="w-4 h-4" />} title="Books" />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {group.books.map((book) => (
                  <div key={book._id} className="flex gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                    <div className="w-14 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                      {book.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
                      ) : (
                        <BookMarked className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{book.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(materialFilter === "all" || materialFilter === "documents") && group.resources.documents.length > 0 && (
            <ResourceList icon={<FileText className="w-4 h-4" />} title="Documents" resources={group.resources.documents} actionLabel="Download" />
          )}

          {(materialFilter === "all" || materialFilter === "videos") && group.resources.videos.length > 0 && (
            <ResourceList icon={<Video className="w-4 h-4" />} title="Videos" resources={group.resources.videos} actionLabel="Open" />
          )}

          {materialFilter === "all" && group.resources.links.length > 0 && (
            <ResourceList icon={<Link className="w-4 h-4" />} title="Links" resources={group.resources.links} actionLabel="Open" />
          )}
        </Card>
      ))}
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
      {icon}
      {title}
    </h3>
  );
}

function ResourceList({
  icon,
  title,
  resources,
  actionLabel,
}: {
  icon: ReactNode;
  title: string;
  resources: CourseMaterialResource[];
  actionLabel: "Open" | "Download";
}) {
  return (
    <section className="space-y-3">
      <SectionTitle icon={icon} title={title} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {resources.map((resource) => (
          <a
            key={resource._id}
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
          >
            <div className="min-w-0">
              <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{resource.title}</p>
              {resource.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{resource.description}</p>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 shrink-0">
              {actionLabel}
              <ExternalLink className="w-4 h-4" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
