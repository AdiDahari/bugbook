import React from "react";
import SessionProvider from "./SessionProvider";
import { redirect } from "next/navigation";
import { validateRequest } from "@/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) return redirect("/login");

  return <SessionProvider value={session}>{children}</SessionProvider>;
}
