import type { NextPage } from 'next'
import { AdminLayout } from '@layout'
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import ChtInstancesList from 'src/components/ChtInstance/ChtInstancesList'
import api from 'src/helpers/api'
import { setInstances } from 'src/store/chtInstanceSlice'
import { useDispatch } from 'react-redux'

const Home: NextPage = () => {
  const { data: session } = useSession()
  const dispatch = useDispatch()

  const fetchChtInstances = async () => {
    try {
      const res = await api.get('/cht-instances')
      dispatch(setInstances(res.data.data))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchChtInstances()
  }, [])

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
