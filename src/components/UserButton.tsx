"use client";

import {
  CheckIcon,
  LogOutIcon,
  Monitor,
  MoonIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import Link from "next/link";
import UserAvatar from "./UserAvatar";
import { cn } from "@/lib/utils";
import { logOut } from "@/app/(auth)/actions";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/app/(main)/SessionProvider";
import { useTheme } from "next-themes";

interface UserButtonProps {
  className?: string;
}

const UserButton = ({ className }: UserButtonProps) => {
  const { user } = useSession();

  const { theme, setTheme } = useTheme();

  const queryClient = useQueryClient();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("flex-none rounded-full", className)}>
          <UserAvatar avatarUrl={user.avatarUrl} size={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-xs font-normal">
          Logged in as <span className="font-bold">@{user.displayName}</span>
        </DropdownMenuLabel>
        <Link href={`/users/${user.username}`}>
          <DropdownMenuItem>
            <UserIcon className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Monitor className="mr-2 size-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className={`${theme === "system" && "text-primary"}`}
              >
                <Monitor className="mr-2 size-4" />
                System
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className={`${theme === "light" && "text-primary"}`}
              >
                <SunIcon className="mr-2 size-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className={`${theme === "dark" && "text-primary"}`}
              >
                <MoonIcon className="mr-2 size-4" />
                Dark
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            queryClient.clear();
            logOut();
          }}
          className="text-red-500"
        >
          <LogOutIcon className="mr-2 size-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
