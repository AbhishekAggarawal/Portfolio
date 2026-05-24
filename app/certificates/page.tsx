import Image from "next/image";
import Link from "next/link";
import { certificates } from "@/lib/certificates";
import { FiArrowUpRight } from "react-icons/fi";

export default function CertificatesPage() {
  return (
    <main className="min-h-screen bg-[#050d1d] px-6 pb-24 pt-36 text-white">
      <section className="mx-auto max-w-[1160px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#b88dff]">Credentials</p>
            <h1 className="mt-4 text-[42px] font-semibold leading-tight sm:text-[60px]">Certificates</h1>
            <p className="mt-5 max-w-[760px] text-sm leading-7 text-white/65 sm:text-base">
              A collection of certificates spanning data engineering, cloud platforms, and machine learning. Each credential represents focused training and hands-on experience.
            </p>
          </div>
          <Link href="/#certificates" className="inline-flex items-center gap-2 text-sm font-semibold text-[#b88dff] hover:text-white">
            Back to homepage
            <FiArrowUpRight />
          </Link>
        </div>

        <div className="mt-14 grid gap-7">
          {certificates.map((cert) => (
            <article key={cert.slug} className="grid overflow-hidden rounded-lg border border-[#2a1f5e] bg-[#0f0a28]/82 lg:grid-cols-[0.42fr_0.58fr]">
              <Link href={cert.live} target="_blank" className="relative min-h-[280px] overflow-hidden bg-[#0e072e]">
                <Image src={cert.image} fill sizes="(min-width: 960px) 470px, 100vw" alt={`${cert.course} certificate`} className="object-cover transition duration-500 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#6d1cff]/25 via-transparent to-[#050d1d]/60" />
              </Link>
              <div className="p-7 sm:p-9">
                <p className="text-xs uppercase tracking-[0.24em] text-[#b88dff]">Certificate</p>
                <h2 className="mt-3 text-3xl font-semibold">{cert.course}</h2>
                <p className="mt-5 text-sm leading-7 text-white/68 sm:text-base">{cert.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {cert.outcome.map((item) => (
                    <span key={item} className="rounded border border-[#3a266f] bg-[#120b30] px-3 py-1 text-xs text-[#b88dff]">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href={cert.live} target="_blank" className="inline-flex items-center gap-2 rounded bg-gradient-to-r from-[#6d1cff] via-[#873dff] to-[#a855f7] px-5 py-3 text-sm font-semibold text-white">
                    View certificate
                    <FiArrowUpRight />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
