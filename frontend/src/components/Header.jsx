import React from 'react'

export default function Header({ 
    title = "Fiscal Impact Simulator",
    docsHref = "/docs",
    githubHref = "https://github.com/mccreajeff/Fiscal_Impact_Sim",
    websiteHref = "https://github.com/mccreajeff",
    onToggleTheme,          // optional function
    isDark = false,         // optional boolean
 }) {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur dark:bg-slate-900/80 sticky top-0 z-10">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="grid grid-cols-[1fr_auto] items-start gap-3">
            <h1 className="min-w-0 break-words text-slate-900 dark:text-slate-100
                            text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
                {title}
            </h1>
            <button
                type="button"
                onClick={onToggleTheme}
                aria-label="Toggle dark mode"
                className="justify-self-end shrink-0 rounded-md border border-slate-200 bg-white px-2.5 py-2 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {isDark ? (<SunIcon className="h-5 w-5 text-slate-200" />) : (<MoonIcon className="h-5 w-5 text-slate-700" />
                )}
            </button>
        </div>
        <nav className="mt-2 flex justify-center gap-4">
          <a
            href={githubHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            aria-label="GitHub repository">
            <GitHubIcon className="h-5 w-5" />
            <span className="text-sm">GitHub</span>
          </a>
          <a
            href={docsHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            aria-label="Project documentation">
            <BookIcon className="h-5 w-5" />
            <span className="text-sm">Docs</span>
          </a>
          <a
            href={websiteHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            aria-label="Website">
            <CompassIcon className="h-5 w-5" />
            <span className="text-sm">Website</span>
          </a>
        </nav>
      </div>
    </header>
  )
}

/* --- Inline SVG icons --- */
function GitHubIcon({ className="" }) { return (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 .5A11.5 11.5 0 0 0 .5 12.3c0 5.2 3.4 9.6 8.1 11.2.6.1.8-.3.8-.6v-2c-3.3.8-4-1.5-4-1.5-.6-1.4-1.4-1.8-1.4-1.8-1.2-.8.1-.8.1-.8 1.3.1 2 .9 2 .9 1.2 2 3.1 1.4 3.8 1 .1-.9.5-1.4.9-1.7-2.7-.3-5.6-1.4-5.6-6.2 0-1.4.5-2.5 1.3-3.4-.1-.3-.6-1.7.1-3.6 0 0 1-.3 3.5 1.3a12 12 0 0 1 6.3 0c2.5-1.6 3.5-1.3 3.5-1.3.7 1.9.2 3.3.1 3.6.8.9 1.3 2 1.3 3.4 0 4.8-2.9 5.9-5.6 6.2.5.4 1 .9 1 1.9v2.8c0 .3.2.7.8.6 4.7-1.6 8.1-6 8.1-11.2C23.5 5.7 18.8.5 12 .5Z"/>
  </svg>
);}
function BookIcon({ className="" }) { return (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2h11A2.5 2.5 0 0 1 20 4.5V20a1 1 0 0 1-1.4.9L12 18.2 5.4 20.9A1 1 0 0 1 4 20V4.5Zm2.5-.5A.5.5 0 0 0 6 4.5V18l6-2.6L18 18V4.5a.5.5 0 0 0-.5-.5h-11Z"/>
  </svg>
);}
function CompassIcon({ className="" }) {return (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm3.9 6.1-2 5a1 1 0 0 1-.6.6l-5 2a.5.5 0 0 1-.7-.7l2-5a1 1 0 0 1 .6-.6l5-2a.5.5 0 0 1 .7.7Z"/>
  </svg>
);}
function MoonIcon({ className="" }) { return (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M21 12.3A9 9 0 0 1 11.7 3a.8.8 0 0 0-1.1 1A7.5 7.5 0 1 0 20 13.4c.1-.4-.3-.9-.8-.8 0 0-.1 0-.2 0Z"/>
  </svg>
);}
function SunIcon({ className="" }) { return (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 5.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm0-3a1 1 0 0 1 1 1v1.2a1 1 0 0 1-2 0V3.5a1 1 0 0 1 1-1Zm0 19.8a1 1 0 0 1-1-1V20a1 1 0 0 1 2 0v1.3a1 1 0 0 1-1 1Zm8-8a1 1 0 0 1-1-1h1.3a1 1 0 0 1 0 2H19a1 1 0 0 1 1-1ZM3 12.3a1 1 0 0 1 1-1H5.3a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1Zm14.9-6.6a1 1 0 0 1 1.4 0l.9.9a1 1 0 0 1-1.4 1.4l-.9-.9a1 1 0 0 1 0-1.4ZM4.7 18.9a1 1 0 0 1 1.4 0l.9.9a1 1 0 1 1-1.4 1.4l-.9-.9a1 1 0 0 1 0-1.4Zm13.7 2.3a1 1 0 0 1 0-1.4l.9-.9a1 1 0 0 1 1.4 1.4l-.9.9a1 1 0 0 1-1.4 0ZM6.1 6.1a1 1 0 0 1 1.4 0l.9.9A1 1 0 1 1 7 8.3l-.9-.9a1 1 0 0 1 0-1.4Z"/>
  </svg>
);}