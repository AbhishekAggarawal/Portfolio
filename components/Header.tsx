import Link from "next/link"
import Nav from "./Nav"
import MobileNav from "./MobileNav"

const Header = () => {
  return (
    <header className="absolute left-0 top-0 z-50 w-full bg-transparent py-7 text-white">
      <div className="mx-auto flex max-w-[1660px] items-center justify-between gap-6 px-8 xl:px-10">
        <Link href="/">
          <h1 className="bg-gradient-to-r from-[#168dff] via-[#2f7dff] to-[#7a3cff] bg-clip-text text-[34px] font-extrabold leading-none tracking-tight text-transparent sm:text-[42px]">
            Abhishek
          </h1>
        </Link>

        <div className="hidden xl:flex items-center">
          <Nav />
        </div>

        <div className="xl:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header
