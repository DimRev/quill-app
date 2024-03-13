import Dashboard from '@/components/dashboard/Dashboard'
import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

const Page = async (props: Props) => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user || !user.id) redirect('/auth-callback?origin=dashboard')

  const dbUser = db.user.findFirst({
    where: {
      id: user.id,
    },
  })

  if (!dbUser) return redirect('/auth-callback?origin=dashboard')

  return <Dashboard />
}

export default Page
