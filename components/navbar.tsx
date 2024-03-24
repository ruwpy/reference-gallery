import { validateRequest } from "@/lib/auth";
import { LoginButton } from "./button-login";
import Link from "next/link";

const Navbar = async () => {
  const { user } = await validateRequest();

  return (
    <div className="flex justify-between border-b border-b-[var(--font-color)]">
      <Link href="/" className="flex-shrink-0">
        <div className="border-r border-r-[var(--font-color)] w-[fit-content] px-[10px] py-[2px] bg-[#f05a24] font-ibm text-[32px] font-[600] tracking-[-3px]">
          r.gallery
        </div>
      </Link>
      <LoginButton user={user} />
    </div>
  );
};

export default Navbar;
