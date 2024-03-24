"use client";

import { usePathname, useRouter } from "next/navigation";

export const Path = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="h-[40px] flex items-center gap-[15px] w-full flex-grow border-b border-[var(--font-color)]">
      <button className="h-full bg-black text-white px-[4px]" onClick={() => router.back()}>
        back
      </button>
      <span>home{pathname}</span>
    </div>
  );
};
