'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface PhotoUploadProps {
  photos: string[]
  onChange: (photos: string[]) => void
  listingId?: string
  userId: string
}

export default function PhotoUpload({ photos, onChange, listingId, userId }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)

    const newUrls: string[] = []
    const folderKey = listingId ?? `pending-${userId}-${Date.now()}`

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `${folderKey}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`

      const { error } = await supabase.storage
        .from('listing-photos')
        .upload(path, file, { upsert: false, contentType: file.type })

      if (!error) {
        const { data } = supabase.storage.from('listing-photos').getPublicUrl(path)
        newUrls.push(data.publicUrl)
      }
    }

    onChange([...photos, ...newUrls])
    setUploading(false)
  }

  function removePhoto(url: string) {
    onChange(photos.filter((p) => p !== url))
  }

  function movePhoto(from: number, to: number) {
    const next = [...photos]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {photos.map((url, i) => (
          <div key={url} className="relative aspect-square rounded overflow-hidden group bg-bg-secondary border border-border">
            <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" />
            {i === 0 && (
              <span className="absolute top-1 left-1 text-xs bg-white/80 text-fg-secondary px-1.5 py-0.5 rounded shadow-sm font-medium">
                Cover
              </span>
            )}
            <div className="absolute inset-0 bg-bg-primary/0 group-hover:bg-bg-primary/30 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => movePhoto(i, i - 1)}
                  className="w-6 h-6 rounded bg-white text-fg-primary text-xs flex items-center justify-center hover:bg-bg-secondary shadow-sm"
                  title="Move left"
                >
                  ←
                </button>
              )}
              <button
                type="button"
                onClick={() => removePhoto(url)}
                className="w-6 h-6 rounded bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 shadow-sm"
                title="Remove"
              >
                ✕
              </button>
              {i < photos.length - 1 && (
                <button
                  type="button"
                  onClick={() => movePhoto(i, i + 1)}
                  className="w-6 h-6 rounded bg-white text-fg-primary text-xs flex items-center justify-center hover:bg-bg-secondary shadow-sm"
                  title="Move right"
                >
                  →
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="aspect-square rounded border-2 border-dashed border-border hover:border-accent/50 text-fg-muted hover:text-accent transition-colors flex flex-col items-center justify-center gap-1 text-xs bg-bg-secondary"
        >
          {uploading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Uploading</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add photo</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="text-xs text-fg-muted">
        First photo is the cover image. JPG, PNG or WebP. Max 5MB each.
      </p>
    </div>
  )
}
