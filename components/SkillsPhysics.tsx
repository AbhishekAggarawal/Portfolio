"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SiPython, SiTensorflow, SiApacheairflow, SiApachespark, SiApachekafka,
  SiDatabricks, SiSnowflake, SiAmazon, SiScikitlearn, SiPowerbi,
  SiPytorch, SiHuggingface, SiLangchain, SiOpenai, SiNumpy, SiPandas,
  SiJupyter, SiDocker,
} from "react-icons/si";
import {
  Database, Brain, Cpu, Sparkles, Bot, ScanSearch, Workflow,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
type CategoryKey = "languages" | "ml" | "data_eng" | "tools" | "ai_llm" | "viz";

interface CategoryDef {
  key: CategoryKey;
  label: string;
  color: string;
  ring: number;
  speed: number;     // seconds per full rotation
  dir: 1 | -1;       // 1 = clockwise, -1 = counter-clockwise
  labelAngle: number; // degrees around ring for category label placement
}

interface SkillData {
  id: number;
  name: string;
  category: CategoryKey;
  color: string;
  glow: string;
  size: number;
  desc: string;
  level: string;
  pct: number;
  icon: React.ComponentType<any>;
}

// ─── Category Definitions ───────────────────────────────────────────────────
const CATEGORIES: Record<CategoryKey, CategoryDef> = {
  languages:  { key: "languages",  label: "Languages",    color: "#FF6B35", ring: 140, speed: 48, dir:  1, labelAngle: 0 },
  ml:         { key: "ml",         label: "ML & DL",       color: "#00E5A0", ring: 225, speed: 60, dir: -1, labelAngle: 10 },
  tools:      { key: "tools",      label: "Tools",         color: "#F59E0B", ring: 285, speed: 64, dir:  1, labelAngle: 350 },
  data_eng:   { key: "data_eng",   label: "Data Eng.",     color: "#38BDF8", ring: 340, speed: 54, dir: -1, labelAngle: 20 },
  viz:        { key: "viz",        label: "Viz & Analytics", color: "#22D3EE", ring: 390, speed: 57, dir:  1, labelAngle: 340 },
  ai_llm:     { key: "ai_llm",     label: "AI & LLMs",     color: "#A855F7", ring: 435, speed: 50, dir: -1, labelAngle: 0 },
};

// ─── Skill Data ─────────────────────────────────────────────────────────────
const SKILLS: SkillData[] = [
  // ── Languages & Frameworks (Orange #FF6B35) ──
  { id: 1,  name: "Python",       category: "languages", color: "#FF6B35", glow: "#FF6B35", size: 58, desc: "Primary language for data pipelines, ML research & backend services.",       level: "Expert",   pct: 96, icon: SiPython },
  { id: 2,  name: "SQL",          category: "languages", color: "#FF6B35", glow: "#FF6B35", size: 54, desc: "Relational modeling and performant queries for analytics.",                     level: "Expert",   pct: 95, icon: Database },
  { id: 3,  name: "NumPy",        category: "languages", color: "#FF6B35", glow: "#FF6B35", size: 54, desc: "Numerical computing foundation for all ML and data science workflows.",         level: "Expert",   pct: 93, icon: SiNumpy },
  { id: 4,  name: "Pandas",       category: "languages", color: "#FF6B35", glow: "#FF6B35", size: 56, desc: "Data wrangling, transformation & analysis for structured datasets.",            level: "Expert",   pct: 91, icon: SiPandas },
  { id: 5,  name: "Jupyter",      category: "languages", color: "#FF6B35", glow: "#FF6B35", size: 52, desc: "Interactive notebooks for ML experimentation and data exploration.",            level: "Expert",   pct: 90, icon: SiJupyter },
  { id: 6,  name: "PySpark",      category: "languages", color: "#FF6B35", glow: "#FF6B35", size: 54, desc: "Distributed data processing at scale via PySpark.",                             level: "Skilled",  pct: 78, icon: SiApachespark },

  // ── Machine Learning (Green #00E5A0) ──
  { id: 7,  name: "ML",           category: "ml", color: "#00E5A0", glow: "#00E5A0", size: 60, desc: "Built ML models for prediction, classification & analytics-driven solutions.",      level: "Advanced", pct: 92, icon: Brain },
  { id: 8,  name: "Deep Learn",   category: "ml", color: "#00E5A0", glow: "#00E5A0", size: 58, desc: "Designed deep neural architectures for complex pattern recognition tasks.",          level: "Advanced", pct: 88, icon: Cpu },
  { id: 9,  name: "TensorFlow",   category: "ml", color: "#00E5A0", glow: "#00E5A0", size: 56, desc: "End-to-end ML platform for training, evaluation & model serving.",                     level: "Advanced", pct: 86, icon: SiTensorflow },
  { id: 10, name: "PyTorch",      category: "ml", color: "#00E5A0", glow: "#00E5A0", size: 56, desc: "Deep learning framework for research and production model deployment.",                level: "Advanced", pct: 87, icon: SiPytorch },
  { id: 11, name: "Sklearn",      category: "ml", color: "#00E5A0", glow: "#00E5A0", size: 54, desc: "ML library for Python with clean APIs for classification & regression.",              level: "Skilled",  pct: 84, icon: SiScikitlearn },

  // ── Data Engineering (Blue #38BDF8) ──
  { id: 12, name: "Data Eng.",    category: "data_eng", color: "#38BDF8", glow: "#38BDF8", size: 56, desc: "Built scalable data lakes, warehouses & streaming architectures.",              level: "Skilled",  pct: 81, icon: Database },
  { id: 13, name: "ETL",          category: "data_eng", color: "#38BDF8", glow: "#38BDF8", size: 54, desc: "Designed robust ETL workflows using Airflow, dbt & cloud-native tools.",        level: "Skilled",  pct: 80, icon: Workflow },
  { id: 14, name: "Spark",        category: "data_eng", color: "#38BDF8", glow: "#38BDF8", size: 56, desc: "Cluster computing for big data processing at scale.",                           level: "Skilled",  pct: 84, icon: SiApachespark },
  { id: 15, name: "Kafka",        category: "data_eng", color: "#38BDF8", glow: "#38BDF8", size: 54, desc: "Real-time event streaming, message brokering & pipeline orchestration.",        level: "Skilled",  pct: 76, icon: SiApachekafka },
  { id: 16, name: "Airflow",      category: "data_eng", color: "#38BDF8", glow: "#38BDF8", size: 54, desc: "Workflow orchestration for ETL and data pipelines.",                            level: "Skilled",  pct: 80, icon: SiApacheairflow },
  { id: 17, name: "Databricks",   category: "data_eng", color: "#38BDF8", glow: "#38BDF8", size: 54, desc: "Unified analytics platform for big data and AI.",                               level: "Skilled",  pct: 82, icon: SiDatabricks },
  { id: 18, name: "Snowflake",    category: "data_eng", color: "#38BDF8", glow: "#38BDF8", size: 54, desc: "Cloud data platform for warehousing and analytics.",                            level: "Skilled",  pct: 83, icon: SiSnowflake },

  // ── AI & LLMs (Purple #A855F7) ──
  { id: 19, name: "Gen AI",       category: "ai_llm", color: "#A855F7", glow: "#A855F7", size: 60, desc: "Fine-tuned LLMs, built RAG systems & diffusion-based creative pipelines.",      level: "Advanced", pct: 90, icon: Sparkles },
  { id: 20, name: "LLMs",         category: "ai_llm", color: "#A855F7", glow: "#A855F7", size: 56, desc: "Deployed and fine-tuned large language models for enterprise applications.",     level: "Advanced", pct: 89, icon: Bot },
  { id: 21, name: "NLP",          category: "ai_llm", color: "#A855F7", glow: "#A855F7", size: 54, desc: "Text classification, entity extraction, sentiment & semantic search.",            level: "Skilled",  pct: 85, icon: Bot },
  { id: 22, name: "CV",           category: "ai_llm", color: "#A855F7", glow: "#A855F7", size: 56, desc: "Real-time object detection, segmentation & image-based AI pipelines.",           level: "Skilled",  pct: 82, icon: ScanSearch },
  { id: 23, name: "Hug. Face",    category: "ai_llm", color: "#A855F7", glow: "#A855F7", size: 54, desc: "Model hub, transformers library & inference pipelines for NLP/CV tasks.",       level: "Advanced", pct: 85, icon: SiHuggingface },
  { id: 24, name: "LangChain",    category: "ai_llm", color: "#A855F7", glow: "#A855F7", size: 54, desc: "LLM orchestration framework for RAG, agents & multi-step chains.",              level: "Skilled",  pct: 83, icon: SiLangchain },
  { id: 25, name: "OpenAI",       category: "ai_llm", color: "#A855F7", glow: "#A855F7", size: 54, desc: "GPT APIs, embeddings, fine-tuning & conversational AI integrations.",           level: "Skilled",  pct: 84, icon: SiOpenai },

  // ── Tools & Platforms (Yellow #F59E0B) ──
  { id: 26, name: "AWS",          category: "tools", color: "#F59E0B", glow: "#F59E0B", size: 56, desc: "Cloud services, serverless infra & managed offerings for scalable solutions.",    level: "Skilled",  pct: 80, icon: SiAmazon },
  { id: 27, name: "Docker",       category: "tools", color: "#F59E0B", glow: "#F59E0B", size: 54, desc: "Containerization for reproducible ML environments and model serving.",             level: "Skilled",  pct: 82, icon: SiDocker },

  // ── Visualization & Analytics (Bright Cyan #22D3EE) ──
  { id: 28, name: "Power BI",     category: "viz", color: "#22D3EE", glow: "#22D3EE", size: 54, desc: "Executive dashboards, DAX measures & self-serve analytics solutions.",             level: "Skilled",  pct: 77, icon: SiPowerbi },
];

// ─── Starfield ───────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 1.8 + 0.5,
  opacity: Math.random() * 0.6 + 0.12,
  delay: Math.random() * 5,
  duration: Math.random() * 2.5 + 1.5,
}));

// ─── Sub-components ──────────────────────────────────────────────────────────

function Star({ x, y, size, opacity, delay, duration }: typeof STARS[number]) {
  return (
    <motion.div
      className="absolute rounded-full bg-white pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, opacity }}
      animate={{ opacity: [opacity, opacity * 0.2, opacity] }}
      transition={{ repeat: Infinity, duration, delay, ease: "easeInOut" }}
    />
  );
}

function NebulaGlows() {
  return (
    <>
      <div className="nebula" style={{ left: "12%", top: "20%",  background: "radial-gradient(circle, rgba(168,85,247,0.09) 0%, transparent 55%)", width: "45%", height: "50%" }} />
      <div className="nebula" style={{ left: "52%", top: "10%",  background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 55%)", width: "42%", height: "48%" }} />
      <div className="nebula" style={{ left: "30%", top: "55%",  background: "radial-gradient(circle, rgba(0,229,160,0.07) 0%, transparent 50%)", width: "50%", height: "42%" }} />
      <div className="nebula" style={{ right: "8%", bottom: "8%", background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 50%)", width: "35%", height: "38%" }} />
      <div className="nebula" style={{ left: "60%", top: "45%",  background: "radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 50%)", width: "30%", height: "35%" }} />
      <div className="nebula" style={{ left: "18%", top: "60%",  background: "radial-gradient(circle, rgba(255,107,53,0.05) 0%, transparent 50%)", width: "28%", height: "32%" }} />
    </>
  );
}

function InfoPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="info-panel"
      style={{
        background: "rgba(7, 14, 30, 0.45)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.07)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated border gradient via pseudo-element sibling */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[20px]"
        style={{ border: "1px solid transparent" }}
        animate={{
          borderColor: [
            "rgba(56,189,248,0.0)",
            "rgba(56,189,248,0.18)",
            "rgba(168,85,247,0.18)",
            "rgba(56,189,248,0.0)",
          ],
        }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />

      <h2 className="info-heading">Skills</h2>
      <p className="info-subtitle">Data & AI</p>
      <p className="info-desc">
        A curated orbit of <strong>28 technologies</strong> spanning machine learning,
        data engineering, AI systems, and cloud platforms — each node representing
        deep expertise built through real-world projects.
      </p>

      <div className="info-legends">
        {Object.values(CATEGORIES).map(cat => (
          <div key={cat.key} className="legend-item">
            <span className="legend-dot" style={{ background: cat.color, boxShadow: `0 0 12px ${cat.color}66` }} />
            <span className="legend-label">{cat.label}</span>
          </div>
        ))}
      </div>

      <p className="info-hint">Hover any node to explore</p>
    </motion.div>
  );
}

function SkillCard({ skill, cat }: { skill: SkillData; cat: CategoryDef }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="skill-detail-card"
      style={{
        borderColor: `${cat.color}44`,
        boxShadow: `0 12px 40px rgba(0,0,0,0.45), 0 0 30px ${cat.color}14`,
      }}
    >
      {/* header row */}
      <div className="skill-detail-header">
        <div
          className="skill-detail-icon"
          style={{ background: `${cat.color}18` }}
        >
          {React.createElement(skill.icon, { size: 26, color: cat.color })}
        </div>
        <div className="skill-detail-meta">
          <span className="skill-detail-name" style={{ color: cat.color }}>
            {skill.name}
          </span>
          <span className="skill-detail-cat">{cat.label}</span>
        </div>
      </div>

      {/* description */}
      <p className="skill-detail-desc">{skill.desc}</p>

      {/* proficiency bar */}
      <div className="skill-detail-bar-wrap">
        <div className="skill-detail-bar-track">
          <motion.div
            className="skill-detail-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${skill.pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            style={{
              background: `linear-gradient(90deg, ${cat.color}88, ${cat.color})`,
              boxShadow: `0 0 10px ${cat.color}44`,
            }}
          />
        </div>
        <span className="skill-detail-pct">{skill.pct}%</span>
      </div>

      {/* level badge */}
      <div
        className="skill-detail-level"
        style={{ background: `${cat.color}14`, color: cat.color, borderColor: `${cat.color}33` }}
      >
        {skill.level}
      </div>
    </motion.div>
  );
}

function CenterCore() {
  return (
    <div className="center-core">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="core-pulse-ring"
          style={{ width: 100 + i * 50, height: 100 + i * 50 }}
          animate={{ opacity: [0.38, 0.03, 0.38], scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 3.5, delay: i * 1.1, ease: "easeInOut" }}
        />
      ))}
      <motion.div
        className="core-glow"
        animate={{ boxShadow: [
          "0 0 28px rgba(56,189,248,0.18), 0 0 50px rgba(168,85,247,0.10)",
          "0 0 40px rgba(56,189,248,0.30), 0 0 64px rgba(168,85,247,0.18)",
          "0 0 28px rgba(56,189,248,0.18), 0 0 50px rgba(168,85,247,0.10)",
        ] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
      >
        <h1 className="core-heading">DATA & AI</h1>
        <span className="core-sub">Skills Orbit</span>
      </motion.div>
    </div>
  );
}

function SkillNodeOnRing({ skill, cat, onHoverChange }: {
  skill: SkillData;
  cat: CategoryDef;
  onHoverChange: (hovered: boolean, rect?: DOMRect) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleHoverStart = useCallback(() => {
    setIsHovered(true);
    const rect = nodeRef.current?.getBoundingClientRect();
    onHoverChange(true, rect);
  }, [onHoverChange]);

  const handleHoverEnd = useCallback(() => {
    setIsHovered(false);
    onHoverChange(false);
  }, [onHoverChange]);

  const nodeSize = skill.size;

  return (
    <motion.div
      ref={nodeRef}
      className="skill-node"
      style={{
        width: nodeSize,
        height: nodeSize,
        borderColor: isHovered ? cat.color : `${cat.color}3a`,
        boxShadow: isHovered
          ? `0 0 22px ${cat.color}55, 0 0 40px ${cat.color}18`
          : `0 0 4px ${cat.color}0d`,
        background: `radial-gradient(circle at 35% 30%, ${cat.color}10 0%, rgba(5,10,24,0.78) 60%)`,
      }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      role="listitem"
      aria-label={`${skill.name} — ${skill.level}`}
      tabIndex={0}
    >
      <div className="skill-node-icon">
        {React.createElement(skill.icon, {
          size: Math.floor(nodeSize * 0.46),
          color: isHovered ? cat.color : `${cat.color}99`,
        })}
      </div>
      <span
        className="skill-node-label"
        style={{
          color: isHovered ? "#fff" : `${cat.color}99`,
          textShadow: isHovered ? `0 0 8px ${cat.color}44` : "none",
        }}
      >
        {skill.name}
      </span>
    </motion.div>
  );
}

function OrbitRing({ cat, skills, onHoverSkill }: {
  cat: CategoryDef;
  skills: SkillData[];
  onHoverSkill: (skill: SkillData | null, rect?: DOMRect) => void;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const ringDiam = cat.ring * 2;

  // Position ring label around the ring at cat.labelAngle degrees
  const labelRad = (cat.labelAngle / 180) * Math.PI;
  const labelLeft = 50 + Math.cos(labelRad) * 50;
  const labelTop = 50 + Math.sin(labelRad) * 50;

  return (
    <div
      className="orbit-ring-container"
      style={{ width: ringDiam, height: ringDiam }}
      role="list"
    >
      {/* category label badge positioned around ring */}
      <div
        className="orbit-ring-label"
        style={{
          borderColor: `${cat.color}55`,
          color: cat.color,
          left: `${labelLeft}%`,
          top: `${labelTop}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        {cat.label}
      </div>

      {/* dashed track indicator — pure circle */}
      <div
        className="orbit-ring-track"
        style={{
          width: ringDiam,
          height: ringDiam,
          borderColor: `${cat.color}3a`,
        }}
      />

      {/* rotating ring layer — pure circular rotation */}
      <div
        className="orbit-ring-rotator"
        style={{
          animationName: cat.dir === 1 ? "orbitCW" : "orbitCCW",
          animationDuration: `${cat.speed}s`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {skills.map((skill, idx) => {
          const angle = (idx / skills.length) * Math.PI * 2 - Math.PI / 2;
          const left = 50 + Math.cos(angle) * 50;
          const top = 50 + Math.sin(angle) * 50;
          return (
            <div
              key={skill.id}
              className="skill-positioner"
              style={{
                left: `${left}%`,
                top: `${top}%`,
              }}
            >
              <SkillNodeOnRing
                skill={skill}
                cat={cat}
                onHoverChange={(hovered, rect) => {
                  setIsPaused(hovered);
                  onHoverSkill(hovered ? skill : null, rect);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MobileSkillGrid() {
  return (
    <div className="mobile-skills-grid-v2" role="list">
      {SKILLS.map(skill => {
        const cat = CATEGORIES[skill.category];
        return (
          <motion.div
            key={skill.id}
            role="listitem"
            className="mobile-skill-card-v2"
            style={{ borderColor: `${cat.color}28` }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="mobile-skill-icon-v2" style={{ background: `${cat.color}14` }}>
              {React.createElement(skill.icon, { size: 22, color: cat.color })}
            </div>
            <div className="mobile-skill-content-v2">
              <span className="mobile-skill-name-v2" style={{ color: cat.color }}>{skill.name}</span>
              <span className="mobile-skill-level-v2">{skill.level} · {skill.pct}%</span>
            </div>
            <div className="mobile-skill-bar-v2">
              <div
                className="mobile-skill-bar-fill-v2"
                style={{ width: `${skill.pct}%`, background: `linear-gradient(90deg, ${cat.color}66, ${cat.color})` }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function SkillsOrbit() {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [tooltipSkill, setTooltipSkill] = useState<SkillData | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const skillsByCategory = useMemo(() => {
    const map: Record<CategoryKey, SkillData[]> = {
      languages: [], ml: [], data_eng: [], tools: [], ai_llm: [], viz: [],
    };
    SKILLS.forEach(s => map[s.category].push(s));
    return map;
  }, []);

  const handleHoverSkill = useCallback((skill: SkillData | null, _rect?: DOMRect) => {
    setTooltipSkill(skill);
  }, []);

  // ── Mobile / Reduced-motion ──────────────────────────────────────────────
  if (isMobile || prefersReducedMotion) {
    return (
      <section className="skills-orbit-root skills-orbit-mobile" aria-label="Skills Orbit">
        <div className="cosmic-bg">
          <NebulaGlows />
        </div>
        <div className="mobile-header">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="mobile-heading">Data & AI</h2>
            <p className="mobile-subtitle">Skills Orbit</p>
            <p className="mobile-desc">
              A curated collection of 28 technologies spanning ML, data engineering, AI systems & cloud platforms.
            </p>
          </motion.div>
          <div className="mobile-legends">
            {Object.values(CATEGORIES).map(cat => (
              <div key={cat.key} className="legend-item">
                <span className="legend-dot" style={{ background: cat.color, boxShadow: `0 0 10px ${cat.color}88` }} />
                <span className="legend-label">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <MobileSkillGrid />
      </section>
    );
  }

  // ── Desktop ───────────────────────────────────────────────────────────────
  return (
    <section className="skills-orbit-root" aria-label="Skills Orbit">
      {/* Cosmic background */}
      <div className="cosmic-bg">
        <NebulaGlows />
        {STARS.map(star => <Star key={star.id} {...star} />)}
      </div>

      {/* Main layout */}
      <div className="orbit-layout">
        <div className="orbit-left-col">
          <InfoPanel />
          <AnimatePresence mode="wait">
            <SkillCard
              key={tooltipSkill ? tooltipSkill.id : SKILLS[0].id}
              skill={tooltipSkill || SKILLS[0]}
              cat={CATEGORIES[(tooltipSkill || SKILLS[0]).category]}
            />
          </AnimatePresence>
        </div>

        <div className="orbit-system">
          <CenterCore />

          {Object.values(CATEGORIES).map(cat => (
            <OrbitRing
              key={cat.key}
              cat={cat}
              skills={skillsByCategory[cat.key]}
              onHoverSkill={handleHoverSkill}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
