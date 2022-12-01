import type { NextPage } from 'next'
import { AdminLayout } from '@layout'
import React from 'react'
import { useSession } from 'next-auth/react'

import AddNewChtInstance from 'src/components/ChtInstance/AddNewChtInstance'

const CreateChtInstance: NextPage = () => {
  const { data: session } = useSession()

  return (
    <AdminLayout>

      <AddNewChtInstance />

    </AdminLayout>
  )
}

export default CreateChtInstance
