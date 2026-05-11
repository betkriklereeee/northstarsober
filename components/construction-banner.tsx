// TEMP: remove before launch
'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'ns_construction_dismissed'

export default function ConstructionBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="construction-heading"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-fg-primary/40 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-bg-card border border-border-accent rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Star icon */}
        <div className="w-12 h-12 rounded-full bg-accent-faint flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-6 h-6 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </div>

        <h2
          id="construction-heading"
          className="text-xl font-bold text-fg-primary mb-3"
        >
          We&rsquo;re almost ready.
        </h2>
        <p className="text-sm text-fg-secondary leading-relaxed mb-7">
          Northstar Sober is launching soon. The directory is live and accepting
          listings &mdash; a few things are still being polished.
        </p>

        <button
          onClick={dismiss}
          className="btn-primary w-full"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
