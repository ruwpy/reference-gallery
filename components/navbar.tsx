import { validateRequest } from "@/lib/auth";
import { LoginButton } from "./button-login";
import Link from "next/link";
import { getStorage } from "@/lib/db/handlers/storage";
import { roundToTwoDigits } from "@/lib/utils";

const Navbar = async () => {
  const { user } = await validateRequest();

  const storage = await getStorage({ userId: user?.id });

  const usedSpaceInGb = roundToTwoDigits((storage?.usedSpace || 0) / Math.pow(1024, 3));
  const spaceLimitInGb = roundToTwoDigits((storage?.spaceLimit || 0) / Math.pow(1024, 3));

  return (
    <div className="flex justify-between border-b border-b-[var(--font-color)]">
      <Link href="/" className="flex-shrink-0">
        <div className="border-r border-r-[var(--font-color)] w-[fit-content] px-[10px] py-[2px] bg-[#f05a24] font-ibm text-[32px] font-[600] tracking-[-3px]">
          r.gallery
        </div>
      </Link>
      <div className="flex items-center gap-[10px]">
        {storage && (
          <span className="opacity-50">
            {usedSpaceInGb}GB/{spaceLimitInGb}GB
          </span>
        )}
        <LoginButton user={user} />
      </div>
    </div>
  );
};

export default Navbar;
