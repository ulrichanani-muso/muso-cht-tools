import type { NextPage } from 'next'
import { AdminLayout } from '@layout'
import React from 'react'
import { flash } from 'src/store/flashMessagesSlice'
import { Button } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

const Home: NextPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  return (
    <AdminLayout>
      <h3 className="mb-4">Menu</h3>

      <Button
        variant="secondary"
        onClick={() => {
          dispatch(flash({ text: 'Retour à la liste des instances' }))
          router.push('/')
        }}
      >
        Retour
      </Button>

    </AdminLayout>
  )
}

export default Home
