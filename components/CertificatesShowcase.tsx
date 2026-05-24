"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { certificates } from "@/lib/certificates";
import { FiArrowUpRight } from "react-icons/fi";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";

const CARDS_PER_PAGE = 2;

export default function CertificatesShowcase() {
  const totalPages = Math.ceil(certificates.length / CARDS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(0);

  const goToPrev = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const visibleCertificates = certificates.slice(
    currentPage * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE + CARDS_PER_PAGE
  );

  return (
    <div>
      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {visibleCertificates.map((cert) => (
          <article
            key={cert.slug}
            className="group overflow-hidden rounded-lg border border-[#1f3768] bg-[#071225]/80 shadow-[0_0_40px_rgba(94,48,255,0.15)]"
          >
            <Link href={cert.live} target="_blank" className="block">
              <div className="relative h-60 overflow-hidden bg-[#0e072e]">
                <Image
                  src={cert.image}
                  fill
                  sizes="(min-width: 960px) 540px, 100vw"
                  alt={`${cert.course} certificate`}
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#6d1cff]/25 via-transparent to-[#050d1d]/55" />
                <span className="absolute left-5 top-5 rounded border border-white/15 bg-[#050d1d]/80 px-3 py-1 text-xs text-white/75">
                  {cert.num}
                </span>
              </div>
            </Link>
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[#b88dff]">
                Certificate
              </p>
              <h3 className="mt-3 text-xl font-semibold text-white">
                {cert.course}
              </h3>
              <p className="mt-4 min-h-[72px] text-sm leading-7 text-white/65">
                {cert.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {cert.outcome.slice(0, 3).map((item) => (
                  <span
                    key={item}
                    className="rounded border border-[#3a266f] bg-[#120b30] px-3 py-1 text-xs text-[#b88dff]"
                  >
                    {item}
                  </span>
                ))}
                {cert.outcome.length > 3 && (
                  <span className="rounded border border-[#3a266f] bg-[#120b30] px-3 py-1 text-xs text-white/50">
                    +{cert.outcome.length - 3} more
                  </span>
                )}
              </div>
              <div className="mt-6">
                <Link
                  href={cert.live}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded bg-gradient-to-r from-[#6d1cff] via-[#873dff] to-[#a855f7] px-4 py-2 text-xs font-semibold text-white"
                >
                  View certificate
                  <FiArrowUpRight />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="mt-10 flex items-center justify-center gap-6">
        <button
          onClick={goToPrev}
          className="grid h-11 w-11 place-items-center rounded-full border border-[#3a266f] bg-[#120b30] text-xl text-[#b88dff] transition hover:border-[#a855f7] hover:text-white"
          aria-label="Previous certificates"
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
                  ? "bg-[#a855f7] shadow-[0_0_10px_#a855f7]"
                  : "bg-[#3a266f] hover:bg-[#5b3fb0]"
              }`}
              aria-label={`Page ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          className="grid h-11 w-11 place-items-center rounded-full border border-[#3a266f] bg-[#120b30] text-xl text-[#b88dff] transition hover:border-[#a855f7] hover:text-white"
          aria-label="Next certificates"
        >
          <PiCaretRightBold />
        </button>
      </div>
    </div>
  );
}