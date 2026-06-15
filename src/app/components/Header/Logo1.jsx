import Link from "next/link";

const Logo = () => {
  return (
    <>
      <Link href="/" className="max-sm:hidden flex items-center">
        <img src="https://res.cloudinary.com/djmnjen6v/image/upload/v1762097380/logo_f7mhch.png" alt="logo" className="w-6" />
        <p className="text-xl font-extrabold text-gray-800">
          RICH
          <span className="text-[#153d38] font-medium">FIELD</span>
        </p>
      </Link>
      <Link href="/" className="hidden max-sm:block">
        <p className="text-2xl font-extrabold text-gray-800">
          RICH
          <span className="text-[#153d38] font-medium">FIELD</span>
        </p>
      </Link>
    </>
  );
};

export default Logo;
