import React from "react";
import { redirect } from "next/navigation";
import { validateRequest } from "@/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();
  if (user) return redirect("/");

  return <>{children}</>;
}
