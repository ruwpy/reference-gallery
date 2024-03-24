"use client";

import { DatabaseUser } from "@/lib/db/schema/user";
import Image from "next/image";
import Link from "next/link";
import { Icons } from "./icons";

export const LoginButton = ({ user }: { user: DatabaseUser | null }) => {
  return (
    <div className="flex flex-shrink-0 justify-center items-center h-[52px] w-[52px] border-l border-l-[var(--font-color)]">
      {user ? (
        <Image src={user.picture} alt="profile picture" width={52} height={52} className="h-full" />
      ) : (
        <Link className="bg-[#f05a24]" href={"/api/login/google"}>
          <Icons.login color="#000" className="w-[52px] h-[52px]" />
        </Link>
      )}
    </div>
  );
};
