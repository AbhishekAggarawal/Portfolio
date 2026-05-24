"use client";

import { useCallback } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { CiMenuFries } from "react-icons/ci";
import { Sparkles } from "lucide-react";

const links = [
  { name: "About me", path: "#about" },
  { name: "Skills", path: "#skills" },
  { name: "Projects", path: "#projects" },
  { name: "Certificates", path: "#certificates" },
  { name: "Contact me", path: "#contact" },
];

const MobileNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSmoothScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
      if (!hash.startsWith("#")) return;

      // Close the mobile sheet by clicking the overlay — handled by radix
      if (pathname === "/") {
        e.preventDefault();
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", hash);
        }
      } else {
        e.preventDefault();
        router.push(`/${hash}`);
      }
    },
    [pathname, router],
  );

  return (
    <Sheet>
      <SheetTrigger className="flex items-center justify-center">
        <CiMenuFries className="text-[32px] text-accent" />
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <div className="mb-10 mt-16 text-center text-2xl">
          <Link href="/">
            <h1 className="bg-gradient-to-r from-[#168dff] via-[#2f7dff] to-[#7a3cff] bg-clip-text text-4xl font-extrabold text-transparent">
              Abhishek
            </h1>
          </Link>
        </div>

        <nav className="flex flex-col items-center justify-center gap-8">
          {links.map((link, index) => (
            <Link
              key={index}
              href={`/${link.path}`}
              onClick={(e) => handleSmoothScroll(e, link.path)}
              className={`${
                pathname === "/"
                  ? "text-white/75"
                  : ""
              } text-xl capitalize transition-all hover:text-accent`}
            >
              {link.name}
            </Link>
          ))}

          <Link
            href="/#assistant"
            onClick={(e) => handleSmoothScroll(e, "#assistant")}
            className="relative mt-2 inline-flex items-center gap-2 rounded-full border border-[#9333ea] bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] px-6 py-3 text-base font-semibold text-white shadow-[0_0_20px_rgba(147,51,234,0.35)] transition-all hover:shadow-[0_0_35px_rgba(147,51,234,0.6)] hover:border-[#a855f7]"
          >
            <Sparkles className="h-4 w-4 text-[#c084fc]" />
            AI Assistant
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#a855f7] opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#c084fc]" />
            </span>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
