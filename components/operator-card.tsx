import Image from 'next/image'
import Link from 'next/link'
import type { Operator } from '@/lib/supabase/types'

interface OperatorCardProps {
  operator: Pick<Operator, 'id' | 'name' | 'avatar_url' | 'location' | 'bio'>
}

function AvatarPlaceholder({ name, size = 64 }: { name: string | null; size?: number }) {
  const initials = name
    ? name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-accent-faint border border-accent/20 flex items-center justify-center shrink-0"
    >
      <span className="text-accent font-semibold text-sm">{initials}</span>
    </div>
  )
}

export default function OperatorCard({ operator }: OperatorCardProps) {
  return (
    <Link href={`/operator/${operator.id}`} className="card p-4 flex items-start gap-3 hover:border-accent/30 transition-colors block">
      {operator.avatar_url ? (
        <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-border">
          <Image
            src={operator.avatar_url}
            alt={operator.name ?? 'Operator'}
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <AvatarPlaceholder name={operator.name} size={64} />
      )}
      <div className="min-w-0">
        {operator.name && (
          <p className="font-semibold text-fg-primary text-sm">{operator.name}</p>
        )}
        {operator.location && (
          <p className="text-xs text-fg-secondary mt-0.5">{operator.location}</p>
        )}
        {operator.bio && (
          <p className="text-xs text-fg-secondary mt-1 line-clamp-2 leading-relaxed">
            {operator.bio}
          </p>
        )}
      </div>
    </Link>
  )
}
