import type { NextPage } from 'next'
import { AdminLayout } from '@layout'
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import ChtInstancePicker from 'src/components/ChtInstance/ChtInstancePicker'
import { getCookieToken } from '../helpers/auth'
    import api from '../helpers/api'

const Home: NextPage = () => {
  const { data: session } = useSession()

  useEffect(() => {
    api.get('/me/profile')
  }, [])

  return (
    <AdminLayout>
      <h3 className="mb-4">
        Bonjour
        {' '}
        {session?.user?.name}
        ,
      </h3>

      <ChtInstancePicker />

    </AdminLayout>
  )
}

export default Home
