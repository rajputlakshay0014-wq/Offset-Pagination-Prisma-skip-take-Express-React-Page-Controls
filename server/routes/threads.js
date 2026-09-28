import { Router } from "express";
import prisma from "../prisma/client.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    // Number of threads per page
    const pageSize = 10;

    // Get page number from query parameter
    const page = Number(req.query.page) || 1;

    // Calculate how many threads to skip
    const skip = (page - 1) * pageSize;

    // Fetch current page and total count together
    const [threads, total] = await Promise.all([
      prisma.thread.findMany({
        skip,
        take: pageSize,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          author: {
            select: {
              name: true,
              avatarUrl: true,
            },
          },

          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),

      prisma.thread.count(),
    ]);

    // Check if another page exists
    const hasMore = total > page * pageSize;

    // Send response
    res.json({
      threads,
      total,
      hasMore,
    });
  } catch (error) {
    next(error);
  }
});

export default router;