import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/portfolio";
import { FaGithub } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[#050d1d] px-6 pb-24 pt-36 text-white">
      <section className="mx-auto max-w-[1160px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#7ebdff]">Case studies</p>
            <h1 className="mt-4 text-[42px] font-semibold leading-tight sm:text-[60px]">Projects</h1>
            <p className="mt-5 max-w-[760px] text-sm leading-7 text-white/65 sm:text-base">
              A deeper collection of selected engineering work. The homepage keeps this short; these pages give each project room to breathe.
            </p>
          </div>
          <Link href="/#projects" className="inline-flex items-center gap-2 text-sm font-semibold text-[#7ebdff] hover:text-white">
            Back to homepage
            <FiArrowUpRight />
          </Link>
        </div>

        <div className="mt-14 grid gap-7">
          {projects.map((project) => (
            <article key={project.slug} className="grid overflow-hidden rounded-lg border border-[#1f3768] bg-[#071225]/82 lg:grid-cols-[0.42fr_0.58fr]">
              <Link href={`/projects/${project.slug}`} className="relative min-h-[280px] overflow-hidden bg-[#110b37]">
                <Image src={project.image} fill sizes="(min-width: 960px) 470px, 100vw" alt={`${project.title} preview`} className="object-contain transition duration-500 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#6d1cff]/25 via-transparent to-[#050d1d]/60" />
              </Link>
              <div className="p-7 sm:p-9">
                <p className="text-xs uppercase tracking-[0.24em] text-[#7ebdff]">{project.category}</p>
                <h2 className="mt-3 text-3xl font-semibold">{project.title}</h2>
                <p className="mt-5 text-sm leading-7 text-white/68 sm:text-base">{project.longDescription}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span key={item} className="rounded border border-[#24406f] bg-[#0b1830] px-3 py-1 text-xs text-[#7ebdff]">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-2 rounded bg-gradient-to-r from-[#087bff] via-[#168dff] to-[#4b6dff] px-5 py-3 text-sm font-semibold text-white">
                    View details
                    <FiArrowUpRight />
                  </Link>
                  {project.live && (
                    <Link href={project.live} target="_blank" className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-[#7ebdff]">
                      Live demo
                      <FiArrowUpRight />
                    </Link>
                  )}
                  <Link href={project.github} target="_blank" className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-[#7ebdff]">
                    <FaGithub />
                    GitHub
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
