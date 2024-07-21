"use server";

import { LogInValues, logInSchema } from "@/lib/validation";

import { cookies } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect";
import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { verify } from "@node-rs/argon2";

export async function logIn(creds: LogInValues): Promise<{ error: string }> {
  try {
    const { username, password } = logInSchema.parse(creds);

    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    const err = { error: "Wrong username and/or password" };
    if (!user?.passwordHash) {
      return err;
    }

    const validPassword = await verify(user.passwordHash, password, {
      memoryCost: 18456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return err;
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = await lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.error(error);

    return { error: "Something went wrong. Try again later." };
  }
}
