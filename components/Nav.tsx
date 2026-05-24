"use client";

import { useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

const links = [
  { name: "About me", path: "#about" },
  { name: "Skills", path: "#skills" },
  { name: "Projects", path: "#projects" },
  { name: "Certificates", path: "#certificates" },
  { name: "Contact me", path: "#contact" },
];

const Nav = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSmoothScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
      // Only intercept hash links
      if (!hash.startsWith("#")) return;

      if (pathname === "/") {
        // Already on homepage – scroll smoothly to the section
        e.preventDefault();
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", hash);
        }
      } else {
        // On another page – navigate to / then the hash will scroll on load
        e.preventDefault();
        router.push(`/${hash}`);
      }
    },
    [pathname, router],
  );

  return (
    <nav className="flex items-center gap-8">
      {links.map((link, index) => (
        <Link
          key={index}
          href={`/${link.path}`}
          onClick={(e) => handleSmoothScroll(e, link.path)}
          className={`${
            pathname === "/" ? "text-white/75" : ""
          } text-[16px] font-medium tracking-[-0.01em] transition-all hover:text-[#168dff]`}
        >
          {link.name}
        </Link>
      ))}

      <Link
        href="/#assistant"
        onClick={(e) => handleSmoothScroll(e, "#assistant")}
        className="relative ml-6 inline-flex items-center gap-2 rounded-full border border-[#9333ea] bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(147,51,234,0.35)] transition-all hover:shadow-[0_0_35px_rgba(147,51,234,0.6)] hover:border-[#a855f7] hover:scale-105"
      >
        <Sparkles className="h-4 w-4 text-[#c084fc]" />
        AI Assistant
        <span className="absolute -right-1 -top-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#a855f7] opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-[#c084fc]" />
        </span>
      </Link>
    </nav>
  );
};

export default Nav;
