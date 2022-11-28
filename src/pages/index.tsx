import type { NextPage } from 'next'
import { AdminLayout } from '@layout'
import React from 'react'
import { useSession } from 'next-auth/react'
import AddNewChtInstance from '../components/ChtInstance/AddNewChtInstance'

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

      <AddNewChtInstance />

    </AdminLayout>
  )
}

export default Home
