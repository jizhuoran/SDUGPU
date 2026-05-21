import { db } from "~/server/db";
import { Prisma } from "@prisma/client";

const DAILY_SUBMISSION_LIMIT = 100;
const MAX_RATE_LIMIT_RETRIES = 10;

type RateLimitResult =
  | {
      allowed: true;
      remainingSubmissions: number;
    }
  | {
      allowed: false;
      error: string;
      statusCode: number;
    };

export async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  if (!userId) {
    return {
      allowed: false,
      error: "Not authenticated",
      statusCode: 401,
    };
  }

  for (let attempt = 0; attempt < MAX_RATE_LIMIT_RETRIES; attempt++) {
    try {
      return await db.$transaction(
        async (tx) => {
          const user = await tx.user.findUnique({
            where: { id: userId },
            select: {
              id: true,
              lastLimitReset: true,
              currentLimit: true,
            },
          });

          if (!user) {
            return {
              allowed: false,
              error: "User not found",
              statusCode: 404,
            };
          }

          const now = new Date();

          if (
            !user.lastLimitReset ||
            user.currentLimit === null ||
            user.currentLimit === undefined ||
            isMoreThanOneDay(user.lastLimitReset, now)
          ) {
            await tx.user.update({
              where: { id: userId },
              data: {
                lastLimitReset: now,
                currentLimit: DAILY_SUBMISSION_LIMIT - 1,
              },
            });

            return {
              allowed: true,
              remainingSubmissions: DAILY_SUBMISSION_LIMIT - 1,
            };
          }

          if (user.currentLimit <= 0) {
            const nextReset = new Date(user.lastLimitReset);
            nextReset.setDate(nextReset.getDate() + 1);
            const timeUntilReset = nextReset.getTime() - now.getTime();
            const hoursUntilReset = Math.floor(
              timeUntilReset / (1000 * 60 * 60)
            );
            const minutesUntilReset = Math.floor(
              (timeUntilReset % (1000 * 60 * 60)) / (1000 * 60)
            );

            return {
              allowed: false,
              error: `Rate limit exceeded. Please try again in ${hoursUntilReset}h ${minutesUntilReset}m.`,
              statusCode: 429,
            };
          }

          const updated = await tx.user.update({
            where: { id: userId },
            data: {
              currentLimit: { decrement: 1 },
            },
            select: {
              currentLimit: true,
            },
          });

          return {
            allowed: true,
            remainingSubmissions: updated.currentLimit ?? 0,
          };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
      );
    } catch (error) {
      if (
        isSerializableConflict(error) &&
        attempt < MAX_RATE_LIMIT_RETRIES - 1
      ) {
        await wait(10 + attempt * 10);
        continue;
      }

      throw error;
    }
  }

  return {
    allowed: false,
    error: "Rate limit check failed. Please try again.",
    statusCode: 500,
  };
}

function isMoreThanOneDay(date1: Date, date2: Date): boolean {
  const diffInMs = date2.getTime() - date1.getTime();
  const msInDay = 1000 * 60 * 60 * 24;
  return diffInMs >= msInDay;
}

function isSerializableConflict(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2034"
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
