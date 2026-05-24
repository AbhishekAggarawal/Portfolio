import Link from "next/link";
import SkillsPhysics from "@/components/SkillsPhysics";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import CertificatesShowcase from "@/components/CertificatesShowcase";
import PortfolioAssistant from "@/components/chat/PortfolioAssistant";
import HeroPhoto from "@/components/HeroPhoto";
import {
  FaAws,
  FaDatabase,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";
import { FiArrowUpRight, FiDownload, FiSend } from "react-icons/fi";
import {
  SiApacheairflow,
  SiApachespark,
  SiCss3,
  SiDocker,
  SiGeeksforgeeks,
  SiGooglecloud,
  SiHtml5,
  SiJavascript,
  SiKubernetes,
  SiLeetcode,
  SiMicrosoftazure,
  SiNumpy,
  SiPandas,
  SiPytorch,
  SiPostgresql,
  SiScikitlearn,
  SiTensorflow,
  SiNextdotjs,
  SiPython,
  SiReact,
} from "react-icons/si";

const heroRoles = ["AI Engineer", "Machine Learning Engineer", "Data Scientist", "MLOps Engineer"];

const heroStats = [
  { value: "450+", label: "Coding Questions Solved" },
  { value: "20+", label: "Technologies Mastered" },
  { value: "2+", label: "Years of Experience" },
];

const heroHighlights = ["LLMs + AI Systems","Big Data Engineering","Modern AI Apps"];

const socialLinks = [
  { label: "LeetCode", href: "https://leetcode.com/u/abhishekmonu2000/", icon: <SiLeetcode /> },
  { label: "GeeksforGeeks", href: "https://www.geeksforgeeks.org/profile/abhishekmonu2000", icon: <SiGeeksforgeeks /> },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/abhishek-aggarwal-2564871bb/", icon: <FaLinkedinIn /> },
  { label: "GitHub", href: "https://github.com/AbhishekAggarawal", icon: <FaGithub /> },
];

const ChatBot = () => (
  <div className="relative mx-auto h-[250px] w-[260px]">
    <div className="absolute left-0 top-8 rounded-[48%_52%_52%_48%/55%_45%_55%_45%] bg-white px-7 py-4 text-2xl font-extrabold text-[#56a9ff] shadow-lg">
      Hello!
    </div>
    <div className="absolute left-24 top-20 h-5 w-8 -rotate-12 rounded-bl-full bg-white" />
    <div className="absolute bottom-8 right-0 h-36 w-32 rounded-[42%] bg-gradient-to-b from-[#3f8cff] to-[#873dff] shadow-[0_0_45px_rgba(89,72,255,0.42)]">
      <div className="absolute -top-2 left-1/2 h-8 w-1 -translate-x-1/2 rounded-full bg-[#5dd7ff]" />
      <div className="absolute -top-7 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-[#765cff]" />
      <div className="absolute left-1/2 top-5 h-14 w-24 -translate-x-1/2 rounded-full border border-[#6ff5ff]/60 bg-[#04101f]">
        <span className="absolute left-6 top-5 h-3 w-3 rounded-full bg-[#8dfffd] shadow-[0_0_8px_#8dfffd]" />
        <span className="absolute right-6 top-5 h-3 w-3 rounded-full bg-[#8dfffd] shadow-[0_0_8px_#8dfffd]" />
        <span className="absolute bottom-3 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-white/80" />
      </div>
      <div className="absolute -left-6 top-20 h-16 w-9 rounded-full bg-[#41a7ff]" />
      <div className="absolute -right-5 top-20 h-16 w-8 rounded-full bg-[#694cff]" />
      <div className="absolute -bottom-8 left-1/2 h-5 w-32 -translate-x-1/2 rounded-full bg-white/85 blur-[1px]" />
    </div>
  </div>
);

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-[#050d1d] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#050d1d_0%,#071026_13%,#07132c_32%,#050d1d_58%),radial-gradient(circle_at_18%_26%,rgba(33,132,255,0.15),transparent_20%),radial-gradient(circle_at_78%_6%,rgba(91,72,255,0.09),transparent_21%),radial-gradient(circle_at_86%_82%,rgba(28,216,255,0.1),transparent_18%)]" />
      <div className="pointer-events-none absolute left-0 top-[900px] h-48 w-48 rounded-full border border-[#243b72]/45 opacity-50 [background:repeating-radial-gradient(circle,transparent_0_16px,rgba(58,96,170,0.4)_17px_18px)]" />
      <div className="pointer-events-none absolute right-20 top-[360px] grid grid-cols-6 gap-2 opacity-35">
        {Array.from({ length: 30 }).map((_, index) => (
          <span key={index} className="h-1.5 w-1.5 rounded-full bg-[#663dff]" />
        ))}
      </div>

      <section id="about-me" className="container relative z-10 mx-auto grid min-h-[700px] items-center gap-14 pb-20 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:pt-36">
        <div className="hero-reveal">
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#1d4f8f] bg-[#071a34]/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#7ebdff] shadow-[0_0_30px_rgba(22,141,255,0.14)]">
            <span className="h-2 w-2 rounded-full bg-[#2ee7ff] shadow-[0_0_14px_#2ee7ff]" />
            Open to high-impact engineering roles
          </div>

          <h1 className="max-w-[720px] text-[42px] font-semibold leading-tight text-white sm:text-[64px]">
            Hi, I am <br />
            <span className="hero-name-gradient font-mono">{`{Abhishek Aggarwal}`}</span>
          </h1>

          <div className="mt-6 h-8 overflow-hidden text-lg font-semibold text-[#b9d9ff] sm:text-2xl">
            <div className="hero-role-rotate">
              {heroRoles.map((role) => (
                <p key={role} className="h-8">{role}</p>
              ))}
              <p className="h-8">{heroRoles[0]}</p>
            </div>
          </div>

          <p className="mt-8 max-w-[700px] text-sm leading-7 text-white/72 sm:text-base">
            Building AI-powered applications, scalable data systems, and intelligent digital experiences through machine learning, data engineering, and modern software development.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {heroHighlights.map((item) => (
              <span key={item} className="rounded border border-[#1d4f8f] bg-[#07172e]/80 px-4 py-2 text-xs font-semibold text-[#9dccff]">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-5">
            <a
              href="https://drive.google.com/file/d/1ZCCkzwfgM8CAjuFP92-UkxqzcA6XEgkd/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-primary-btn inline-flex h-12 items-center gap-3 rounded bg-gradient-to-r from-[#087bff] via-[#168dff] to-[#4b6dff] px-8 text-sm font-semibold text-white shadow-[0_0_26px_rgba(39,112,255,0.35)]"
            >
              <FiDownload />
              Download CV
            </a>
            <Link
              href="#projects"
              className="inline-flex h-12 items-center gap-3 rounded border border-[#4b4dbc] px-8 text-sm font-semibold text-white/90 transition hover:border-[#168dff] hover:text-white"
            >
              <FiSend />
              Start Project
            </Link>
          </div>

          <div className="mt-10 grid max-w-[620px] grid-cols-3 gap-3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4 backdrop-blur">
                <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                <p className="mt-2 text-xs leading-5 text-white/55">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <HeroPhoto />
      </section>

      <section id="about" className="container relative z-10 mx-auto grid items-center gap-12 py-20 lg:grid-cols-[0.42fr_0.58fr]">
        <h2 className="text-[34px] font-medium text-white sm:text-[44px]">About me</h2>
        <div className="rounded-lg border border-[#24406f] bg-[#071225]/75 shadow-[0_0_90px_rgba(37,111,255,0.18)] backdrop-blur">
          <div className="flex h-10 items-center gap-2 border-b border-white/8 px-5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5d76]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffc857]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#3ce987]" />
            <span className="mx-auto h-2 w-44 rounded-full bg-[#0b2a5f]" />
          </div>
          <div className="p-7 sm:p-12">
            <div className="mb-7 rounded bg-[#0b1a31] px-5 py-4 text-[#d7e9ff]">
              <span className="mr-3 text-[#ffd85a]">*</span>
              Who am I?
            </div>
            <p className="max-w-[720px] text-sm leading-7 text-white/72 sm:text-base">
              I am an AI and data-focused engineer passionate about building intelligent, scalable, and impactful digital products. I work across AI/ML, data engineering, modern web technologies, and cloud-ready systems to create seamless user experiences and practical real-world solutions.
            </p>
          </div>
        </div>
      </section>

      <section id="skills" className="relative z-10 mx-auto py-24">
        <SkillsPhysics />
      </section>

      <section id="projects" className="container relative z-10 mx-auto py-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[34px] font-medium text-white sm:text-[44px]">Projects</h2>
            <p className="mt-4 max-w-[820px] text-base leading-7 text-white/65">
              Quick previews live here. Open a project when you want the full case-study view.
            </p>
          </div>
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-[#7ebdff] hover:text-white">
            View all projects
            <FiArrowUpRight />
          </Link>
        </div>

        <ProjectsShowcase />
      </section>

      <section id="certificates" className="container relative z-10 mx-auto py-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[34px] font-medium text-white sm:text-[44px]">Certificates</h2>
            <p className="mt-4 max-w-[960px] text-base leading-7 text-white/65">
              Check out some of my certificates, ranging from data engineering and cloud platforms to machine learning.
            </p>
          </div>
          <Link href="/certificates" className="inline-flex items-center gap-2 text-sm font-semibold text-[#7ebdff] hover:text-white">
            View all certificates
            <FiArrowUpRight />
          </Link>
        </div>

        <CertificatesShowcase />
      </section>

      <section id="assistant" className="relative z-10 mx-auto py-20">
        <PortfolioAssistant />
      </section>

      <section id="contact" className="container relative z-10 mx-auto py-20">
        <h2 className="max-w-[850px] text-[34px] font-medium text-white sm:text-[44px]">
          Let&apos;s start something great together
        </h2>
        <Link
          href="/contact"
          className="mt-10 inline-flex h-12 items-center rounded bg-gradient-to-r from-[#087bff] via-[#168dff] to-[#4b6dff] px-8 text-sm font-semibold text-white shadow-[0_0_26px_rgba(39,112,255,0.32)]"
        >
          Get in touch
        </Link>
        <div className="mt-24 h-[190px] overflow-hidden">
          <svg viewBox="0 0 1040 220" className="h-full w-full" fill="none" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, index) => (
              <path
                key={index}
                d={`M0 ${88 + index * 4} C 250 ${72 + index * 4}, 330 ${92 - index * 3}, 470 ${100} C 605 ${108 + index * 5}, 650 ${index % 2 ? 28 : 180}, 790 ${100} C 900 ${164 - index * 7}, 970 ${42 + index * 8}, 1040 ${92 + index * 4}`}
                stroke={index < 6 ? "#14c8ff" : "#743bff"}
                strokeOpacity="0.55"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
      </section>

      <footer className="container relative z-10 mx-auto grid gap-10 pb-12 pt-8 text-white/72 sm:grid-cols-[1fr_1fr_0.6fr]">
        <div>
          <h3 className="text-2xl font-semibold text-white">Follow me at :</h3>
          <div className="mt-6 flex gap-3">
            {socialLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                aria-label={item.label}
                className="grid h-9 w-9 place-items-center rounded bg-[#0d88ff] text-white transition hover:bg-[#315dff]"
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <p>+91 8789830967</p>
          <p>abhishekmonu2000@gmail.com</p>
          <p>India</p>
        </div>
        <div className="space-y-3 text-sm">
          <Link href="#projects" className="block hover:text-white">Projects</Link>
          <Link href="#certificates" className="block hover:text-white">Certificates</Link>
          <Link href="#skills" className="block hover:text-white">Skills</Link>
        </div>
        <p className="sm:col-span-3 pt-10 text-center text-xs text-white/45"> © Copyright 2026 Made by Abhishek</p>
      </footer>
    </main>
  );
}
