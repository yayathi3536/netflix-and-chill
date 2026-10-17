import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { getAssetUrl } from '../data/tracks';

/**
 * Cinematic background. Swap this file (public/landing/hero-bg.webp) for any
 * photo you like; the overlay in index.css keeps the text readable on top of it.
 */
const HERO_BACKGROUND = getAssetUrl('landing/hero-bg.webp');

/** Stagger helper for the fade-in animations (see .landing-fade* in index.css). */
const delay = (ms: number) => ({ '--d': `${ms}ms` }) as React.CSSProperties;

/**
 * Opening landing page.
 *
 * Both calls to action only navigate (hash routes handled in Root.tsx).
 * They do NOT sign anyone in: real authentication comes in a later step.
 */
export function LandingPage() {
  const [backgroundReady, setBackgroundReady] = useState(false);

  return (
    <div className="font-landing relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#000000] text-[#FFFFFF]">
      {/* Cinematic background: image + dark overlay + vignette */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#000000]">
        <img
          src={HERO_BACKGROUND}
          alt=""
          decoding="async"
          fetchPriority="high"
          onLoad={() => setBackgroundReady(true)}
          onError={() => setBackgroundReady(false)}
          className={`landing-bg absolute inset-0 h-full w-full object-cover transition-opacity duration-[1800ms] ease-out ${
            backgroundReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div className="landing-overlay absolute inset-0" />
        <div className="landing-vignette absolute inset-0" />
      </div>

      {/* Top bar: brand (left) and Sign In (right) */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-6 lg:px-14 lg:pt-8">
        <div
          className="landing-fade font-bebas select-none text-[1.9rem] uppercase leading-none text-[#E50914] sm:text-4xl lg:text-5xl"
          style={delay(100)}
        >
          OUR UNIVERSE
        </div>

        <a
          href="#sign-in"
          style={delay(250)}
          className="landing-fade inline-flex items-center rounded-[4px] bg-[#E50914] px-4 py-1.5 text-sm font-semibold text-[#FFFFFF] transition-colors duration-200 hover:bg-[#E50914]/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF] sm:px-5 sm:py-2 sm:text-base"
        >
          Sign In
        </a>
      </header>

      {/* Centered hero copy */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 pb-[16vh] pt-12 text-center sm:px-10">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
          <h1
            style={delay(350)}
            className="landing-fade-up text-balance text-[clamp(2.1rem,10.4vw,3.6rem)] font-black sm:text-[clamp(3rem,7.2vw,5rem)] leading-[1.04] tracking-[-0.025em] text-[#FFFFFF] [text-shadow:0_2px_32px_rgba(0,0,0,0.65)]"
          >
            Every Story Begins With Us.
          </h1>

          <p
            style={delay(650)}
            className="landing-fade-up mt-5 max-w-2xl text-balance text-[clamp(1.05rem,2.3vw,1.5rem)] font-medium leading-snug text-[#B3B3B3] sm:mt-6"
          >
            <span className="inline-block">Our memories.</span>{' '}
            <span className="inline-block">Our music.</span>{' '}
            <span className="inline-block">Our little universe.</span>
          </p>

          <a
            href="#get-started"
            style={delay(950)}
            className="landing-fade-up group mt-9 inline-flex items-center gap-2 rounded-[4px] bg-[#E50914] px-7 py-3.5 text-lg font-semibold text-[#FFFFFF] shadow-[0_12px_44px_-12px_rgba(229,9,20,0.65)] transition duration-200 hover:bg-[#E50914]/85 hover:shadow-[0_14px_52px_-10px_rgba(229,9,20,0.75)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFFFFF] sm:mt-10 sm:px-9 sm:py-4 sm:text-2xl"
          >
            Get Started
            <ChevronRight
              aria-hidden="true"
              className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 sm:h-7 sm:w-7"
            />
          </a>
        </div>
      </main>

      {/* Netflix-style curved horizon with a red glow */}
      <div aria-hidden="true" className="landing-curve" />
    </div>
  );
}
