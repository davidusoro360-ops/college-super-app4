import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuth, requireAuth } from "./auth";

export const getCourseMaterialsForStudent = query({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const auth = await getAuth(ctx, args.clerkUserId);
    requireAuth(auth);

    const user = auth.user;
    if (!user?.departmentId || !user.semester || !user.collegeId) {
      return [];
    }

    const courses = await ctx.db
      .query("courses")
      .withIndex("by_departmentId_semester", (q) =>
        q.eq("departmentId", user.departmentId!).eq("semester", user.semester!)
      )
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    return await Promise.all(
      courses.map(async (course) => {
        const [books, resources] = await Promise.all([
          ctx.db
            .query("books")
            .withIndex("by_collegeId_courseId", (q) =>
              q.eq("collegeId", user.collegeId!).eq("courseId", course._id)
            )
            .collect(),
          ctx.db
            .query("resources")
            .withIndex("by_courseId", (q) => q.eq("courseId", course._id))
            .filter((q) => q.eq(q.field("status"), "active"))
            .collect(),
        ]);

        const activeBooks = books.filter(
          (book) => !book.status || book.status === "available" || book.status === "active"
        );

        const documents = resources.filter((resource) => resource.type === "document");
        const videos = resources.filter((resource) => resource.type === "video");
        const links = resources.filter((resource) => resource.type === "link");

        return {
          courseId: course._id,
          courseName: course.name,
          courseCode: course.code,
          books: activeBooks.map((book) => ({
            _id: book._id,
            title: book.title,
            author: book.author,
            coverUrl: book.coverUrl || book.imageUrl || "",
          })),
          resources: {
            documents,
            videos,
            links,
          },
        };
      })
    );
  },
});