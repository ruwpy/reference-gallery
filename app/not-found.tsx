import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="p-[10px] text-[18px]">
      <h2>404 - not found</h2>
      <Link className="underline" href={"/"}>
        return to home page
      </Link>
    </div>
  );
};

export default NotFoundPage;
