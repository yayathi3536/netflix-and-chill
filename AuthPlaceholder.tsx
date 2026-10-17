import React from 'react';

type PlaceholderKind = 'sign-in' | 'get-started';

const COPY: Record<PlaceholderKind, { title: string; body: string }> = {
  'sign-in': {
    title: 'Sign In',
    body: 'Sign-in is coming in the next step. Nothing on this page signs you in yet.',
  },
  'get-started': {
    title: 'Get Started',
    body: 'Account setup and profile selection are coming in the next step. Nothing on this page creates an account yet.',
  },
};

/**
 * Temporary destination for the landing page's Sign In / Get Started buttons.
 * It is deliberately NOT a login form and never authenticates anyone.
 * Replace it when real authentication is implemented.
 */
export function AuthPlaceholder({ kind }: { kind: PlaceholderKind }) {
  const { title, body } = COPY[kind];

  return (
    <div className="font-landing flex min-h-[100svh] w-full flex-col bg-[#000000] text-[#FFFFFF]">
      <header className="flex items-center px-5 pt-5 sm:px-8 sm:pt-6 lg:px-14 lg:pt-8">
        <a
          href="#"
          aria-label="Our Universe, back to the start"
          className="font-bebas text-[1.9rem] uppercase leading-none text-[#E50914] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFFFFF] sm:text-4xl lg:text-5xl"
        >
          OUR UNIVERSE
        </a>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="landing-fade-up w-full max-w-md rounded-lg border border-[#808080]/30 bg-[#141414] p-8 text-center sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">Coming next</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-4 text-[#B3B3B3]">{body}</p>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href="#"
              className="rounded-[4px] bg-[#E50914] px-6 py-3 font-semibold text-[#FFFFFF] transition-colors duration-200 hover:bg-[#E50914]/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
            >
              Back to start
            </a>
            <a
              href="#home"
              className="text-sm text-[#B3B3B3] underline-offset-4 transition-colors duration-200 hover:text-[#FFFFFF] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
            >
              Preview the current site (temporary)
            </a>
            {kind === 'sign-in' && (
              <a
                href="#login"
                className="text-sm text-[#808080] underline-offset-4 transition-colors duration-200 hover:text-[#B3B3B3] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
              >
                Admin sign-in
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
