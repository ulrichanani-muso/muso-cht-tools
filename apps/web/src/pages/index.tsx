import type { NextPage } from 'next'
import { AdminLayout } from '@layout'
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import ChtInstancePicker from 'src/components/ChtInstance/ChtInstancePicker'
import { getCookieToken } from '../helpers/auth'

const Home: NextPage = () => {
  const { data: session } = useSession()

  useEffect(() => {
    axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/me/profile', {
      headers: { Authorization: `Bearer ${getCookieToken()}` }
    })
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
