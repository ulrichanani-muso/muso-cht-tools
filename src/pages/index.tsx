import type { NextPage } from 'next'
import { AdminLayout } from '@layout'
import React from 'react'
import { useSession } from 'next-auth/react'
import { setInstances } from 'src/store/chtInstanceSlice'
import { useDispatch } from 'react-redux'
import AddNewChtInstance from '../components/ChtInstance/AddNewChtInstance'

import prisma from '../../lib/prisma'

const Home: NextPage = ({ instances }) => {
  const { data: session } = useSession()
  const dispatch = useDispatch()

  dispatch(setInstances(instances))

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

export const getStaticProps = async () => {
  const instances = await prisma.chtInstance.findMany()

  return {
    props: { instances },
  }
}
