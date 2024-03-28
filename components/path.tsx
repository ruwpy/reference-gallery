"use client";

import { env } from "@/env.mjs";
import { generateId } from "lucia";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export const Path = () => {
  const pathname = usePathname();

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? env.NEXT_PUBLIC_BASE_URL_PROD
      : env.NEXT_PUBLIC_BASE_URL_DEV;

  const backLink = pathname.split("/").slice(0, -1).join("/");

  return (
    <div className="h-[40px] flex items-center gap-[10px] pr-[50px] w-full flex-grow border-b border-[var(--font-color)]">
      <Link
        className="h-full inline-flex items-center bg-black text-white px-[4px]"
        href={`${baseUrl}${backLink}`}
      >
        back
      </Link>
      <span className="flex justify-end overflow-hidden">
        <Link href={"/"}>home</Link>
        {pathname.split("/").map((p) => (
          <Link key={generateId(5)} href={`${baseUrl}${pathname.split(p)[0] + p}`}>
            {p}/
          </Link>
        ))}
      </span>
    </div>
  );
};
