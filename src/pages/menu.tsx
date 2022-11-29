import type { NextPage } from 'next'
import { AdminLayout } from '@layout'
import React from 'react'
import { useSession } from 'next-auth/react'

import ChtInstancePicker from 'src/components/ChtInstance/ChtInstancePicker'

const Home: NextPage = () => {
  const { data: session } = useSession()

  return (
    <AdminLayout>
      <h3 className="mb-4">Menu</h3>

    </AdminLayout>
  )
}

export default Home
