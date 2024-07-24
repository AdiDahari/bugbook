"use client";

import { HTTPError } from "ky";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { UserData } from "@/lib/types";
import UserTootip from "./UserTootip";
import kyInstance from "@/lib/ky";
import { useQuery } from "@tanstack/react-query";

interface UserLinkWithTooltipProps extends PropsWithChildren {
  username: string;
}

const UserLinkWithTooltip = ({
  children,
  username,
}: UserLinkWithTooltipProps) => {
  const { data } = useQuery({
    queryKey: ["usre-data", username],
    queryFn: () =>
      kyInstance.get(`/api/users/username/${username}/`).json<UserData>(),
    retry: (failureCount, error) => {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }

      return failureCount < 3;
    },
    staleTime: Infinity,
  });

  if (!data) {
    return (
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    );
  }

  return (
    <UserTootip user={data}>
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    </UserTootip>
  );
};

export default UserLinkWithTooltip;
