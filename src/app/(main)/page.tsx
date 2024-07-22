import ForYouField from "./ForYouField";
import { Loader2 } from "lucide-react";
import Post from "@/components/posts/Post";
import PostEditor from "@/components/posts/editor/PostEditor";
import { Suspense } from "react";
import TrendsSidebar from "@/components/TrendsSidebar";
import { postDataInclude } from "@/lib/types";
import prisma from "@/lib/prisma";

export default async function Home() {
  const posts = await prisma.post.findMany({
    include: postDataInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <ForYouField />
      </div>
      <TrendsSidebar />
    </main>
  );
}
