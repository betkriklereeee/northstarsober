import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-6 text-center bg-bg-primary">
      <div>
        <p className="text-6xl font-bold text-accent/20 mb-4">404</p>
        <h1 className="text-xl font-bold text-fg-primary mb-2">Page not found</h1>
        <p className="text-sm text-fg-secondary mb-6">
          This listing may have moved or been removed.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Back to directory
        </Link>
      </div>
    </div>
  )
}
