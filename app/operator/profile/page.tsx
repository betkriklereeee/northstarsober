import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/profile-form'

export const metadata = { title: 'Your profile' }

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/operator/login')

  const { data: operator } = await supabase
    .from('operators')
    .select('id, name, avatar_url, bio, location, website, public_email, public_phone')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-fg-primary">Your profile</h1>
        <p className="text-sm text-fg-secondary mt-0.5">
          This information appears on your listings and your public profile page.
        </p>
      </div>
      <ProfileForm operator={operator} userId={user.id} />
    </div>
  )
}
