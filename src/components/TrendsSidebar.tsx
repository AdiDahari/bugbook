import React, { Suspense } from "react";

import FollowButton from "./FollowButton";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import UserAvatar from "./UserAvatar";
import UserTootip from "./UserTootip";
import { formatNumber } from "@/lib/utils";
import { getUserDataSelect } from "@/lib/types";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { validateRequest } from "@/auth";

const TrendsSidebar = () => {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-16 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <FollowSuggestions />
        <TrendingTopics />
      </Suspense>
    </div>
  );
};

async function FollowSuggestions() {
  const { user } = await validateRequest();

  if (!user) return;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">You might like</div>
      {usersToFollow.map((u) => (
        <div key={u.id} className="flex items-center justify-between gap-3">
          <UserTootip user={u}>
            <Link
              href={`/users/${u.username}`}
              className="flex items-center gap-3"
            >
              <UserAvatar avatarUrl={u.avatarUrl} />
              <div>
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {u.displayName}
                </p>
                <p className="line-clamp-1 break-all text-muted-foreground">
                  @{u.username}
                </p>
              </div>
            </Link>
          </UserTootip>
          <FollowButton
            userId={u.id}
            initialState={{
              followers: u._count.followers,
              isFollowedByUser: u.followers.some(
                ({ followerId }) => followerId === u.id,
              ),
            }}
          />
        </div>
      ))}
    </div>
  );
}

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
    SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
    FROM posts
    GROUP BY (hashtag)
    ORDER BY count DESC, hashtag ASC
    LIMIT 5
  `;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  {
    revalidate: 3 * 60 * 60,
  },
);
async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Trends</div>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.substring(1);

        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

export default TrendsSidebar;
