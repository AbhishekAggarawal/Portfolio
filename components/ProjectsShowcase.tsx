"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/portfolio";
import { FaGithub } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";

const CARDS_PER_PAGE = 2;

export default function ProjectsShowcase() {
  const totalPages = Math.ceil(projects.length / CARDS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(0);

  const goToPrev = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const visibleProjects = projects.slice(
    currentPage * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE + CARDS_PER_PAGE
  );

  return (
    <div>
      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {visibleProjects.map((project) => (
          <article
            key={project.slug}
            className="group overflow-hidden rounded-lg border border-[#1f3768] bg-[#071225]/80 shadow-[0_0_40px_rgba(37,111,255,0.12)]"
          >
            <Link href={`/projects/${project.slug}`} className="block">
              <div className="relative h-52 overflow-hidden bg-[#110b37]">
                <Image
                  src={project.image}
                  fill
                  sizes="(min-width: 960px) 540px, 100vw"
                  alt={`${project.title} project preview`}
                  className="object-contain transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#6d1cff]/30 via-transparent to-[#050d1d]/55" />
                <span className="absolute left-5 top-5 rounded border border-white/15 bg-[#050d1d]/80 px-3 py-1 text-xs text-white/75">
                  {project.num}
                </span>
              </div>
            </Link>
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[#7ebdff]">
                {project.category}
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                {project.title}
              </h3>
              <p className="mt-4 min-h-[84px] text-sm leading-7 text-white/65">
                {project.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.stack.slice(0, 3).map((item) => (
                  <span
                    key={item}
                    className="rounded border border-[#24406f] bg-[#0b1830] px-3 py-1 text-xs text-[#7ebdff]"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-4">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-2 rounded bg-gradient-to-r from-[#087bff] via-[#168dff] to-[#4b6dff] px-4 py-2 text-xs font-semibold text-white"
                >
                  View details
                  <FiArrowUpRight />
                </Link>
                {project.github && (
                  <Link
                    href={project.github}
                    target="_blank"
                    className="text-lg text-white/65 hover:text-[#7ebdff]"
                    aria-label={`${project.title} GitHub`}
                  >
                    <FaGithub />
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="mt-10 flex items-center justify-center gap-6">
        <button
          onClick={goToPrev}
          className="grid h-11 w-11 place-items-center rounded-full border border-[#24406f] bg-[#0b1830] text-xl text-[#7ebdff] transition hover:border-[#168dff] hover:text-white"
          aria-label="Previous projects"
        >
          <PiCaretLeftBold />
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                idx === currentPage
                  ? "bg-[#168dff] shadow-[0_0_10px_#168dff]"
                  : "bg-[#24406f] hover:bg-[#3b5fa0]"
              }`}
              aria-label={`Page ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          className="grid h-11 w-11 place-items-center rounded-full border border-[#24406f] bg-[#0b1830] text-xl text-[#7ebdff] transition hover:border-[#168dff] hover:text-white"
          aria-label="Next projects"
        >
          <PiCaretRightBold />
        </button>
      </div>
    </div>
  );
}