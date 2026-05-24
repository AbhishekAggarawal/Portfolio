"use client"

import { motion } from "framer-motion"
import Image from "next/image"

// ─── Types ───────────────────────────────────────────────────────────────────

interface OrbitRingProps {
  size: number
  borderColor: string
  dotColor: string
  duration: number
  reverse?: boolean
  tiltX?: number
  tiltY?: number
  dotCount?: number
  dotSize?: number
}

interface FloatingParticleProps {
  size: number
  left: number
  top: number
  color: string
  duration: number
  delay: number
}

interface AuraGlowProps {
  size: number
  color: string
  left: number
  top: number
  duration: number
  delay: number
}

// ─── Orbit Ring ──────────────────────────────────────────────────────────────
// Three-layer nesting: outer (positioning) → tilt (perspective) → rotation
// This keeps rotateX/Y static while the CSS animation spins the inner ring.

const OrbitRing = ({
  size,
  borderColor,
  dotColor,
  duration,
  reverse = false,
  tiltX = 0,
  tiltY = 0,
  dotCount = 3,
  dotSize = 5,
}: OrbitRingProps) => {
  const half = size / 2

  const dots = Array.from({ length: dotCount }).map((_, i) => {
    const angle = (i * 360) / dotCount
    const rad = (angle * Math.PI) / 180
    return {
      left: `${50 + 50 * Math.cos(rad)}%`,
      top: `${50 + 50 * Math.sin(rad)}%`,
    }
  })

  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: "50%",
        top: "50%",
        marginLeft: -half,
        marginTop: -half,
      }}
    >
      {/* Static tilt layer — never animated */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)` }}
      >
        {/* Spinning layer — driven by CSS animation */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: `1.5px solid ${borderColor}30`,
            animation: `heroOrbit ${duration}s linear infinite ${reverse ? "reverse" : ""}`,
          }}
        >
          {dots.map((pos, i) => (
            <div
              key={i}
              className="absolute rounded-full hero-orbit-dot"
              style={{
                width: dotSize,
                height: dotSize,
                left: pos.left,
                top: pos.top,
                transform: "translate(-50%, -50%)",
                background: dotColor,
                boxShadow: `0 0 ${dotSize * 2}px ${dotColor}, 0 0 ${dotSize * 4.5}px ${dotColor}85`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Floating Particle ───────────────────────────────────────────────────────
// Safe: uses left/top for positioning and framer-motion x/y for animation.
// x/y are independent CSS properties that don't collide with left/top.

const FloatingParticle = ({ size, left, top, color, duration, delay }: FloatingParticleProps) => (
  <motion.div
    className="absolute rounded-full pointer-events-none z-10"
    style={{
      width: size,
      height: size,
      left: `${left}%`,
      top: `${top}%`,
      background: color,
      boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}65`,
    }}
    animate={{
      x: [0, 16, -10, 7, -4, 0],
      y: [0, -14, 9, -5, 3, 0],
      opacity: [0.12, 0.5, 0.28, 0.55, 0.2, 0.12],
      scale: [1, 1.35, 0.85, 1.2, 0.9, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
)

// ─── Aura Glow ───────────────────────────────────────────────────────────────
// Uses marginLeft/Top for centering instead of translate(-50%,-50%) to avoid
// framer-motion overriding the positioning transform with its scale animation.

const AuraGlow = ({ size, color, left, top, duration, delay }: AuraGlowProps) => {
  const half = size / 2
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${left}%`,
        top: `${top}%`,
        marginLeft: -half,
        marginTop: -half,
        background: `radial-gradient(circle, ${color} 0%, transparent 72%)`,
        filter: "blur(35px)",
      }}
      animate={{
        scale: [1, 1.22, 0.92, 1.14, 1],
        opacity: [0.3, 0.6, 0.35, 0.55, 0.3],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

// ─── Main HeroPhoto Component ────────────────────────────────────────────────

const HeroPhoto = () => {
  const PHOTO_W = 330
  const PHOTO_H = 360
  const pHalfW = PHOTO_W / 2
  const pHalfH = PHOTO_H / 2

  return (
    <div className="relative mx-auto h-[500px] w-full max-w-[520px] sm:h-[520px]">
      {/* ── Background aura glows ── */}
      <AuraGlow size={240} color="rgba(22,141,255,0.32)" left={46} top={42} duration={5.5} delay={0} />
      <AuraGlow size={200} color="rgba(111,77,255,0.28)" left={54} top={54} duration={4.8} delay={0.9} />
      <AuraGlow size={170} color="rgba(46,231,255,0.22)" left={48} top={48} duration={6.5} delay={0.4} />
      <AuraGlow size={140} color="rgba(22,141,255,0.35)" left={50} top={46} duration={4.2} delay={1.6} />

      {/* ── Morphing blob behind photo ── */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          className="hero-morph-blob h-72 w-72"
          style={{
            background:
              "linear-gradient(135deg, rgba(74,120,255,0.22), rgba(111,77,255,0.28), rgba(46,231,255,0.14))",
            filter: "blur(28px)",
          }}
        />
      </div>

      {/* ── 3D Orbit rings ── */}
      <OrbitRing
        size={440}
        borderColor="#2e8fff"
        dotColor="#5eb8ff"
        duration={30}
        tiltX={18}
        tiltY={8}
        dotCount={4}
        dotSize={5}
      />
      <OrbitRing
        size={370}
        borderColor="#6f4dff"
        dotColor="#9d7aff"
        duration={24}
        reverse
        tiltX={22}
        tiltY={-8}
        dotCount={3}
        dotSize={4}
      />
      <OrbitRing
        size={310}
        borderColor="#2ee7ff"
        dotColor="#5df0ff"
        duration={20}
        tiltX={14}
        tiltY={10}
        dotCount={3}
        dotSize={3.5}
      />

      {/* ── Photo centerpiece ── */}
      {/* Outer wrapper handles centering via margins — never touched by animation */}
      <div
        className="absolute z-20"
        style={{
          left: "50%",
          top: "50%",
          width: PHOTO_W,
          height: PHOTO_H,
          marginLeft: -pHalfW,
          marginTop: -pHalfH,
        }}
      >
        {/* Inner motion div only animates opacity/scale — no transform conflict */}
        <motion.div
          className="relative w-full h-full"
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.95, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Glass frame */}
          <div className="hero-glass-frame absolute -inset-5 rounded-[48%_52%_45%_55%/42%_42%_58%_58%] border border-white/[0.1] bg-white/[0.02] backdrop-blur-[2px]" />

          {/* Photo container */}
          <div className="hero-portrait-morph relative h-full w-full overflow-hidden">
            <Image
              src="/assets/imagge-transparent.png"
              fill
              priority
              sizes="330px"
              alt="Abhishek Aggarwal portrait"
              className="object-cover object-top"
            />

            {/* Bottom gradient fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050d1d]/35 via-transparent to-transparent pointer-events-none" />

            {/* Light sweep */}
            <div className="hero-light-sweep absolute inset-0 pointer-events-none" />
          </div>

          {/* Pulsing glow ring around photo */}
          <div className="hero-photo-glow absolute -inset-2 rounded-[48%_52%_45%_55%/42%_42%_58%_58%] pointer-events-none" />
        </motion.div>
      </div>

      {/* ── Floating luminous particles ── */}
      <FloatingParticle size={3} left={12} top={22} color="#5eb8ff" duration={5} delay={0} />
      <FloatingParticle size={4.5} left={84} top={15} color="#9d7aff" duration={6} delay={1.4} />
      <FloatingParticle size={3} left={92} top={58} color="#5df0ff" duration={4.5} delay={0.7} />
      <FloatingParticle size={5} left={6} top={68} color="#7ebdff" duration={6.5} delay={2.2} />
      <FloatingParticle size={3.5} left={74} top={88} color="#5eb8ff" duration={5.5} delay={1.9} />
      <FloatingParticle size={4} left={22} top={82} color="#9d7aff" duration={5} delay={0.5} />
      <FloatingParticle size={3} left={48} top={8} color="#5df0ff" duration={5.8} delay={3.1} />
      <FloatingParticle size={4} left={56} top={90} color="#7ebdff" duration={4.8} delay={2.6} />
      <FloatingParticle size={3} left={38} top={15} color="#5eb8ff" duration={6.2} delay={1.1} />
      <FloatingParticle size={3.5} left={88} top={38} color="#9d7aff" duration={5.3} delay={3.5} />

      {/* ── Fun Fact card ── */}
      <motion.div
        className="absolute bottom-3 left-1 hidden rounded-lg border border-[#1d4f8f]/70 bg-[#07172e]/80 px-5 py-4 shadow-[0_0_35px_rgba(22,141,255,0.16)] backdrop-blur z-30 sm:block"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.7, ease: "easeOut" }}
        whileHover={{
          scale: 1.03,
          boxShadow: "0 0 55px rgba(22,141,255,0.3)",
          borderColor: "rgba(46,143,255,0.5)",
        }}
      >
        <p className="text-xs uppercase tracking-[0.22em] text-[#7ebdff]">Fun Fact</p>
        <p className="mt-2 max-w-[220px] text-sm font-semibold leading-snug text-white">
          Every time you prove you aren't a robot, you are actually training one!
        </p>
      </motion.div>
    </div>
  )
}

export default HeroPhoto