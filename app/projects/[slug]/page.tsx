import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/portfolio";
import { FaGithub } from "react-icons/fa";
import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";

type ProjectDetailProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export function generateMetadata({ params }: ProjectDetailProps) {
  const project = projects.find((item) => item.slug === params.slug);

  if (!project) {
    return {
      title: "Project not found",
    };
  }

  return {
    title: `${project.title} | Abhishek Aggarwal`,
    description: project.description,
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailProps) {
  const project = projects.find((item) => item.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050d1d] px-6 pb-24 pt-36 text-white">
      <article className="mx-auto max-w-[1160px]">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-[#7ebdff] hover:text-white">
          <FiArrowLeft />
          Back to projects
        </Link>

        <header className="mt-10 grid gap-10 lg:grid-cols-[0.52fr_0.48fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#7ebdff]">{project.category}</p>
            <h1 className="mt-4 text-[42px] font-semibold leading-tight sm:text-[64px]">{project.title}</h1>
            <p className="mt-6 max-w-[720px] text-base leading-8 text-white/68">{project.longDescription}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            {project.live && (
              <Link href={project.live} target="_blank" className="inline-flex items-center gap-2 rounded bg-gradient-to-r from-[#087bff] via-[#168dff] to-[#4b6dff] px-5 py-3 text-sm font-semibold text-white">
                Live demo
                <FiArrowUpRight />
              </Link>
            )}
            <Link href={project.github} target="_blank" className="inline-flex items-center gap-2 rounded border border-[#24406f] px-5 py-3 text-sm font-semibold text-white/80 hover:text-white">
              <FaGithub />
              GitHub
            </Link>
          </div>
        </header>

        <div className="relative mt-12 h-[330px] overflow-hidden rounded-lg border border-[#251d70] bg-[#110b37] shadow-[0_0_80px_rgba(71,45,255,0.25)] sm:h-[520px]">
          <Image src={project.image} fill priority sizes="(min-width: 960px) 1160px, 100vw" alt={`${project.title} interface preview`} className="object-contain" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#6d1cff]/20 via-transparent to-[#050d1d]/50" />
        </div>

        <section className="mt-12 grid gap-8 lg:grid-cols-[0.58fr_0.42fr]">
          <div className="rounded-lg border border-[#1f3768] bg-[#071225]/82 p-7 sm:p-9">
            <h2 className="text-2xl font-semibold">What it does</h2>
            <p className="mt-5 text-sm leading-7 text-white/68 sm:text-base">{project.description}</p>
            <div className="mt-8 grid gap-4">
              {project.highlights.map((highlight) => (
                <div key={highlight} className="rounded border border-[#17345e] bg-[#071225] px-5 py-4 text-sm text-white/72">
                  {highlight}
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-[#1f3768] bg-[#071225]/82 p-7 sm:p-9">
            <h2 className="text-2xl font-semibold">Tech stack</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span key={item} className="rounded border border-[#24406f] bg-[#0b1830] px-3 py-1.5 text-xs text-[#7ebdff]">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-9 border-t border-white/10 pt-7">
              <p className="text-sm leading-7 text-white/62">
                This page exists for visitors who want more than the homepage preview. The main page stays fast to scan, and this detail view carries the deeper explanation.
              </p>
            </div>
          </aside>
        </section>
      </article>
    </main>
  );
}
