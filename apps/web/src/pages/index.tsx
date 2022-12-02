import type { NextPage } from 'next'
import { AdminLayout } from '@layout'
import React from 'react'
import { useSession } from 'next-auth/react'
import ChtInstancesList from 'src/components/ChtInstance/ChtInstancesList'

const Home: NextPage = () => {
  const { data: session } = useSession()

  return (
    <AdminLayout>
      <h3 className="mb-4">
        Bonjour
        {' '}
        {session?.user?.name}
        ,
      </h3>

      <ChtInstancesList />

    </AdminLayout>
  )
}

export default Home
