"use server";

import { postDataInclude } from "@/lib/types";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";

export async function deletePost(id: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const filter = { where: { id } };
  const post = await prisma.post.findUnique(filter);

  if (!post) throw new Error("Post not found");

  if (post.userId !== user.id) throw new Error("Unauthorized");

  const deletedPost = await prisma.post.delete({
    ...filter,
    include: postDataInclude,
  });

  return deletedPost;
}
