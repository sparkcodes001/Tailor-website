import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import heroBg from '../../assets/images/hero/hero-bg.jpg'
import { createCustomOrderLink } from '../../utils/whatsapp'

const Hero = () => {
  const heroRef = useRef(null)
  const imageRef = useRef(null)
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // ---- CUSTOM CURSOR ----
  useEffect(() => {
    const moveCursor = (e) => {
      const { clientX: x, clientY: y } = e
      setMousePos({ x, y })

      gsap.to(cursorRef.current, {
        x: x - 20,
        y: y - 20,
        duration: 0.5,
        ease: 'power2.out',
      })
      gsap.to(cursorDotRef.current, {
        x: x - 4,
        y: y - 4,
        duration: 0.1,
        ease: 'none',
      })
    }

    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [])

  // ---- PARALLAX ON MOUSE MOVE ----
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth - 0.5) * 20
      const y = (e.clientY / innerHeight - 0.5) * 10

      gsap.to(imageRef.current, {
        x: x,
        y: y,
        duration: 1.2,
        ease: 'power2.out',
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // ---- ENTRANCE ANIMATIONS ----
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })

      // Line reveal
      tl.fromTo(
        '.line-reveal',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 1, ease: 'power3.inOut', stagger: 0.1 }
      )

      // Badge
      tl.fromTo(
        '.hero-badge',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.5'
      )

      // Each heading line clip reveal
      tl.fromTo(
        '.heading-line',
        { y: '100%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power4.out',
        },
        '-=0.4'
      )

      // Sub text
      tl.fromTo(
        '.hero-sub',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      )

      // Buttons
      tl.fromTo(
        '.hero-btn',
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'back.out(2)',
        },
        '-=0.4'
      )

      // Stats
      tl.fromTo(
        '.hero-stat',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
        },
        '-=0.3'
      )

      // Right side card
      tl.fromTo(
        '.side-card',
        { opacity: 0, x: 50, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        },
        '-=0.8'
      )

      // Floating elements
      tl.fromTo(
        '.float-el',
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(2)',
        },
        '-=0.5'
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  // ---- FLOATING ANIMATION ----
  useEffect(() => {
    gsap.to('.float-card-1', {
      y: -12,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    })
    gsap.to('.float-card-2', {
      y: -8,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay: 0.5,
    })
    gsap.to('.float-card-3', {
      y: -10,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay: 1,
    })

    // Scroll bounce
    gsap.to('.scroll-dot', {
      y: 10,
      repeat: -1,
      yoyo: true,
      duration: 1.2,
      ease: 'power1.inOut',
    })
  }, [])

  // ---- BUTTON HOVER MAGNETIC EFFECT ----
  const handleBtnMouseMove = (e) => {
    const btn = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' })
  }

  const handleBtnMouseLeave = (e) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' })
  }

  return (
    <>
      {/* ---- CUSTOM CURSOR ---- */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border 
                   border-[#b8f7e4]/60 z-[999] pointer-events-none 
                   mix-blend-difference hidden lg:block"
        style={{ position: 'fixed' }}
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#b8f7e4] 
                   z-[999] pointer-events-none hidden lg:block"
        style={{ position: 'fixed' }}
      />

      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden 
                   bg-[#15171a]"
      >
        {/* ---- BACKGROUND ---- */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            ref={imageRef}
            src={heroBg}
            alt="hero"
            className="w-full h-full object-cover object-center scale-110"
            style={{ willChange: 'transform' }}
          />

          {/* Multi layer overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(110deg, rgba(15,17,20,0.98) 0%, rgba(15,17,20,0.93) 30%, rgba(15,17,20,0.6) 58%, rgba(15,17,20,0.15) 100%)',
            }}
          />

          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-48"
            style={{
              background: 'linear-gradient(to top, #25272c, transparent)',
            }}
          />

          {/* Mint radial glow */}
          <div
            className="absolute top-20 right-40 w-[500px] h-[500px] 
                       rounded-full opacity-15 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(184,247,228,0.4) 0%, transparent 65%)',
            }}
          />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(184,247,228,1) 1px, transparent 1px), linear-gradient(90deg, rgba(184,247,228,1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* ---- CONTENT ---- */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full 
                        pt-28 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 
                          items-center">

            {/* LEFT - TEXT */}
            <div>

              {/* Top line */}
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="line-reveal h-[1px] w-12 bg-[#b8f7e4]"
                />
                <div
                  className="hero-badge flex items-center gap-2 
                             text-[#b8f7e4] text-xs font-semibold 
                             tracking-[0.2em] uppercase"
                >
                  <span className="w-1.5 h-1.5 bg-[#b8f7e4] rounded-full 
                                   animate-pulse" />
                  Est. Premium Tailoring
                </div>
              </div>

              {/* Heading with clip reveal */}
              <h1 className="font-display font-bold leading-[1.05] mb-8">

                <div className="overflow-hidden mb-2">
                  <div
                    className="heading-line text-white text-5xl 
                               md:text-6xl lg:text-[5.5rem]"
                  >
                    Crafted
                  </div>
                </div>

                <div className="overflow-hidden mb-2">
                  <div
                    className="heading-line text-5xl md:text-6xl 
                               lg:text-[5.5rem] flex items-center gap-4"
                  >
                    <span className="text-white">For</span>
                    <span
                      className="italic"
                      style={{
                        background:
                          'linear-gradient(135deg, #b8f7e4 0%, #7ee8c8 50%, #b8f7e4 100%)',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        animation: 'shimmer 3s linear infinite',
                      }}
                    >
                      You
                    </span>
                  </div>
                </div>

                <div className="overflow-hidden">
                  <div
                    className="heading-line text-white/30 text-4xl 
                               md:text-5xl lg:text-6xl font-light 
                               tracking-widest"
                  >
                    · Worldwide ·
                  </div>
                </div>

              </h1>

              {/* Divider line */}
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="line-reveal h-[1px] flex-1 max-w-[80px]"
                  style={{
                    background:
                      'linear-gradient(90deg, #b8f7e4, transparent)',
                  }}
                />
                <p
                  className="hero-sub text-white/55 text-base md:text-lg 
                             leading-relaxed max-w-md"
                >
                  Your exact measurements, your style, your fabric. 
                  We sew it perfectly and ship it to your doorstep 
                  — anywhere on earth.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-14">

                {/* Primary - Magnetic */}
                <Link
                  to="/shop"
                  onMouseMove={handleBtnMouseMove}
                  onMouseLeave={handleBtnMouseLeave}
                  className="hero-btn group relative inline-flex items-center 
                             gap-3 px-8 py-4 rounded-2xl font-bold text-sm 
                             text-[#25272c] overflow-hidden
                             transition-shadow duration-300
                             hover:shadow-2xl hover:shadow-[#b8f7e4]/30"
                  style={{ background: '#b8f7e4' }}
                >
                  {/* Shimmer effect */}
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100
                               transition-opacity duration-500"
                    style={{
                      background:
                        'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
                      animation: 'shimmer-btn 1s ease forwards',
                    }}
                  />
                  <span className="relative z-10 tracking-wide">
                    Browse Collection
                  </span>
                  <span
                    className="relative z-10 w-7 h-7 bg-[#25272c]/15 
                               rounded-full flex items-center justify-center
                               group-hover:translate-x-1 transition-transform 
                               duration-300"
                  >
                    →
                  </span>
                </Link>

                {/* Secondary - Magnetic */}
                <a
                  href={createCustomOrderLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseMove={handleBtnMouseMove}
                  onMouseLeave={handleBtnMouseLeave}
                  className="hero-btn group relative inline-flex items-center 
                             gap-3 px-8 py-4 rounded-2xl font-semibold text-sm 
                             text-white overflow-hidden
                             transition-all duration-300
                             hover:shadow-xl hover:shadow-black/30"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(184,247,228,0.2)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <span
                    className="absolute inset-0 opacity-0 
                               group-hover:opacity-100 transition-opacity 
                               duration-500"
                    style={{
                      background:
                        'linear-gradient(105deg, transparent 40%, rgba(184,247,228,0.08) 50%, transparent 60%)',
                    }}
                  />
                  {/* WhatsApp pulse icon */}
                  <span className="relative z-10 flex items-center gap-2">
                    <span
                      className="w-2 h-2 bg-green-400 rounded-full 
                                 animate-pulse"
                    />
                    <span className="tracking-wide">Custom Order</span>
                  </span>
                  <span
                    className="relative z-10 text-[#b8f7e4] 
                               group-hover:rotate-45 transition-transform 
                               duration-300"
                  >
                    ✦
                  </span>
                </a>

              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 flex-wrap">
                {[
                  { number: '500+', label: 'Customers' },
                  { number: '50+', label: 'Countries' },
                  { number: '100%', label: 'Handmade' },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className="hero-stat flex items-center gap-3"
                  >
                    {i !== 0 && (
                      <div className="w-px h-8 bg-white/10" />
                    )}
                    <div>
                      <p
                        className="text-2xl font-bold font-display"
                        style={{
                          background:
                            'linear-gradient(135deg, #b8f7e4, #7ee8c8)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {stat.number}
                      </p>
                      <p className="text-white/40 text-xs tracking-wider 
                                    uppercase">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* RIGHT - FLOATING CARDS */}
            <div className="hidden lg:flex flex-col items-end gap-5 
                            relative pr-4">

              {/* Main floating card */}
              <div
                className="float-card-1 side-card w-64 rounded-3xl p-5 
                           relative overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(184,247,228,0.12)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center 
                               justify-center text-lg"
                    style={{ background: 'rgba(184,247,228,0.1)' }}
                  >
                    ✂️
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">
                      Custom Fit
                    </p>
                    <p className="text-white/40 text-xs">Your measurements</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="space-y-2">
                  {['Fabric', 'Stitching', 'Fitting'].map((item, i) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="text-white/40 text-xs w-14">
                        {item}
                      </span>
                      <div
                        className="flex-1 h-1 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.06)' }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${[85, 92, 78][i]}%`,
                            background:
                              'linear-gradient(90deg, #b8f7e4, #7ee8c8)',
                          }}
                        />
                      </div>
                      <span className="text-[#b8f7e4] text-xs">
                        {[85, 92, 78][i]}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping card */}
              <div
                className="float-card-2 side-card w-56 rounded-3xl p-4 
                           ml-12 relative"
                style={{
                  background: 'rgba(184,247,228,0.06)',
                  border: '1px solid rgba(184,247,228,0.15)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center 
                               justify-center"
                    style={{ background: 'rgba(184,247,228,0.15)' }}
                  >
                    🌍
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">
                      Ships Worldwide
                    </p>
                    <p className="text-[#b8f7e4] text-xs mt-0.5">
                      50+ countries reached
                    </p>
                  </div>
                </div>

                {/* Avatar stack */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex -space-x-2">
                    {['🇬🇧', '🇺🇸', '🇨🇦', '🇦🇺'].map((flag, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border border-[#25272c] 
                                   flex items-center justify-center text-xs"
                        style={{ background: 'rgba(255,255,255,0.1)' }}
                      >
                        {flag}
                      </div>
                    ))}
                  </div>
                  <span className="text-white/40 text-xs">+46 more</span>
                </div>
              </div>

              {/* Rating card */}
              <div
                className="float-card-3 side-card w-52 rounded-3xl p-4"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-[#b8f7e4] text-sm">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-white text-sm font-bold">5.0</span>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">
                  "Absolutely perfect fit. Better than any store 
                  I've visited!"
                </p>
                <p className="text-[#b8f7e4] text-xs mt-2 font-medium">
                  — Sarah J, London 🇬🇧
                </p>
              </div>

              {/* Decorative dots */}
              <div className="float-el absolute -top-8 right-0 flex gap-1.5">
                {[1, 2, 3].map((d) => (
                  <div
                    key={d}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: 'rgba(184,247,228,0.3)' }}
                  />
                ))}
              </div>

              {/* Decorative circle */}
              <div
                className="float-el absolute bottom-0 right-0 w-32 h-32 
                           rounded-full opacity-10"
                style={{
                  border: '1px solid #b8f7e4',
                }}
              />

            </div>

          </div>
        </div>

        {/* ---- BOTTOM BAR ---- */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 border-t"
          style={{ borderColor: 'rgba(184,247,228,0.08)' }}
        >
          <div
            className="max-w-7xl mx-auto px-6 py-4 flex items-center 
                       justify-between"
          >
            {/* Scroll indicator */}
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-9 rounded-full border flex items-start 
                           justify-center p-1"
                style={{ borderColor: 'rgba(255,255,255,0.15)' }}
              >
                <div
                  className="scroll-dot w-1 h-2.5 rounded-full"
                  style={{ background: '#b8f7e4' }}
                />
              </div>
              <span
                className="text-xs tracking-[0.2em] uppercase"
                style={{ color: 'rgba(255,255,255,0.25)' }}
              >
                Scroll to explore
              </span>
            </div>

            {/* Marquee text */}
            <div className="hidden md:flex items-center gap-2 overflow-hidden">
              <div
                className="flex gap-6 text-xs tracking-widest uppercase"
                style={{ color: 'rgba(255,255,255,0.15)' }}
              >
                {['Custom Tailoring', '·', 'Ready Made', '·',
                  'Alterations', '·', 'Worldwide Shipping', '·',
                  'Premium Quality'].map((item, i) => (
                  <span key={i}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---- SHIMMER KEYFRAMES ---- */}
        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
          @keyframes shimmer-btn {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>

      </section>
    </>
  )
}

export default Hero