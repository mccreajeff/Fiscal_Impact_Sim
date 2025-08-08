import React from 'react'

export default function Footer({
    baselineLoaded = "True",
    version = "0.1.0",
    apiBase  // omitted
}) {
  return (
    <footer className="w-full border-t bg-white/80 backdrop-blur sticky bottom-0 z-10">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-center gap-2 p-3 text-sm">
            <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 border text-xs ${baselineLoaded ? 
                    'bg-emerald-50 text-emerald-700 border-emerald-200': 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                </span>
                {version && (<span className="rounded-full px-2.5 py-1 border text-xs bg-slate-50 text-slate-700 border-slate-200">API v{version}
                </span>
                            )}
                {apiBase && (<span className="hidden sm:inline rounded-full px-2.5 py-1 border text-xs bg-slate-50 text-slate-600 border-slate-200">{apiBase}
                </span>
                            )}
            </div>
        </div>
    </footer>
  )
}