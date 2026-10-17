import React, { useEffect, useState } from 'react';
import App from './App';
import { LandingPage } from './components/LandingPage';
import { AuthPlaceholder } from './components/AuthPlaceholder';

/**
 * Top-level view switcher. The project already uses hash routes
 * (#memories, #admin, #login, ...), so this reuses that scheme:
 *
 *   (empty hash) or #landing -> opening landing page
 *   #sign-in                 -> sign-in placeholder (no real auth yet)
 *   #get-started             -> get-started placeholder (no real auth yet)
 *   anything else            -> the existing site, exactly as before
 *                               (#home, #memories, #admin, #login, ...)
 */
type View = 'landing' | 'sign-in' | 'get-started' | 'site';

export function viewFromHash(hash: string): View {
  const key = hash.replace(/^#\/?/, '').trim().toLowerCase();
  if (key === '' || key === 'landing') return 'landing';
  if (key === 'sign-in') return 'sign-in';
  if (key === 'get-started') return 'get-started';
  return 'site';
}

export default function Root() {
  const [view, setView] = useState<View>(() => viewFromHash(window.location.hash));

  useEffect(() => {
    const onHashChange = () => {
      setView(viewFromHash(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (view === 'landing') return <LandingPage />;
  if (view === 'sign-in' || view === 'get-started') return <AuthPlaceholder kind={view} />;
  return <App />;
}
