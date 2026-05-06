import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ADMIN_ONLY, getAuth, requireAuth, requireRole } from "./auth";
import type { Doc } from "./_generated/dataModel";

export const getBookHubData = query({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const auth = await getAuth(ctx, args.clerkUserId);
    requireAuth(auth);

    const user = auth.user;
    if (!user) {
      return [];
    }

    let timetableEntries: Doc<"timetable">[] = [];

    if (auth.role === "faculty" && auth.userId) {
      timetableEntries = await ctx.db
        .query("timetable")
        .withIndex("by_facultyId", (q) => q.eq("facultyId", auth.userId!))
        .filter((q) => q.eq(q.field("status"), "active"))
        .collect();
    } else if (auth.role === "student") {
      if (!user.departmentId || !user.semester) {
        return [];
      }

      const courses = await ctx.db
        .query("courses")
        .withIndex("by_departmentId_semester", (q) =>
          q.eq("departmentId", user.departmentId!).eq("semester", user.semester!)
        )
        .filter((q) => q.eq(q.field("status"), "active"))
        .collect();

      for (const course of courses) {
        const courseEntries = await ctx.db
          .query("timetable")
          .withIndex("by_courseId", (q) => q.eq("courseId", course._id))
          .filter((q) => q.eq(q.field("status"), "active"))
          .collect();
        timetableEntries.push(...courseEntries);
      }
    } else if (user.collegeId) {
      timetableEntries = await ctx.db
        .query("timetable")
        .withIndex("by_collegeId", (q) => q.eq("collegeId", user.collegeId!))
        .filter((q) => q.eq(q.field("status"), "active"))
        .collect();
    }

    const courseIds = [...new Set(timetableEntries.map((entry) => entry.courseId))];
    const courses = (await Promise.all(courseIds.map((courseId) => ctx.db.get(courseId))))
      .filter((course): course is Doc<"courses"> =>
        course !== null &&
        course.status === "active" &&
        (user.collegeId ? course.collegeId === user.collegeId : true)
      );

    return await Promise.all(
      courses.map(async (course) => {
        const courseBooks = await ctx.db
          .query("books")
          .withIndex("by_collegeId_courseId", (q) =>
            q.eq("collegeId", course.collegeId).eq("courseId", course._id)
          )
          .collect();

        const activeBooks = courseBooks.filter(
          (book) => !book.status || book.status === "available" || book.status === "active"
        );

        const books = await Promise.all(
          activeBooks.map(async (book) => {
            const linkedFiles = await ctx.db
              .query("resources")
              .withIndex("by_collegeId_bookId", (q) =>
                q.eq("collegeId", book.collegeId).eq("bookId", book._id)
              )
              .collect();

            const validFiles = linkedFiles.filter((file) => file.status === "active");

            const pdfFile = validFiles.find((file) =>
              file.fileType?.toLowerCase() === "pdf" ||
              file.type === "document" ||
              file.url.toLowerCase().includes(".pdf")
            );

            return {
              _id: book._id,
              title: book.title,
              author: book.author,
              coverUrl: book.coverUrl || book.imageUrl || "",
              hasPdf: Boolean(pdfFile),
              pdfUrl: pdfFile?.url,
            };
          })
        );

        return {
          course: {
            _id: course._id,
            name: course.name,
            code: course.code,
          },
          books,
        };
      })
    );
  },
});

export const assignBookToCourse = mutation({
  args: {
    clerkUserId: v.string(),
    bookId: v.id("books"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    requireRole(await getAuth(ctx, args.clerkUserId), ADMIN_ONLY);

    const [book, course] = await Promise.all([
      ctx.db.get(args.bookId),
      ctx.db.get(args.courseId),
    ]);

    if (!book) {
      throw new Error("Book not found");
    }

    if (!course) {
      throw new Error("Course not found");
    }

    if (book.collegeId !== course.collegeId) {
      throw new Error("Book and course must belong to the same college");
    }

    await ctx.db.patch(args.bookId, {
      courseId: args.courseId,
    });

    return { success: true, bookId: args.bookId, courseId: args.courseId };
  },
});

export const attachResourceToBook = mutation({
  args: {
    clerkUserId: v.string(),
    resourceId: v.id("resources"),
    bookId: v.id("books"),
  },
  handler: async (ctx, args) => {
    requireRole(await getAuth(ctx, args.clerkUserId), ADMIN_ONLY);

    const [resource, book] = await Promise.all([
      ctx.db.get(args.resourceId),
      ctx.db.get(args.bookId),
    ]);

    if (!resource) {
      throw new Error("Resource not found");
    }

    if (!book) {
      throw new Error("Book not found");
    }

    if (resource.collegeId !== book.collegeId) {
      throw new Error("Resource and book must belong to the same college");
    }

    await ctx.db.patch(args.resourceId, {
      bookId: args.bookId,
    });

    return { success: true, resourceId: args.resourceId, bookId: args.bookId };
  },
});