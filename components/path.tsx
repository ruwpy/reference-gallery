"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export const Path = () => {
  const pathname = usePathname();

  const backLink = pathname.split("/").slice(0, -1).join("/");

  return (
    <div className="h-[40px] flex items-center gap-[10px] pr-[50px] w-full flex-grow border-b border-[var(--font-color)]">
      <Link
        className="h-full inline-flex items-center bg-black text-white px-[4px]"
        href={`${window.location.origin}${backLink}`}
      >
        back
      </Link>
      <span className="flex justify-end overflow-hidden">
        <Link href={"/"}>home</Link>
        {pathname.split("/").map((p) => (
          <Link href={`${window.location.origin}${pathname.split(p)[0] + p}`}>{p}/</Link>
        ))}
      </span>
    </div>
  );
};
