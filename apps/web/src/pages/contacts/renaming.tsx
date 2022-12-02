import type { NextPage } from 'next'
import { AdminLayout } from '@layout'
import React from 'react'
import { Button, Card } from 'react-bootstrap'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const Home: NextPage = () => {

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between w-100">
        <h3 className="mb-4">Renommage de contacts</h3>
        <div>
          <Link href="/menu">
            <Button className="px-3">
              <FontAwesomeIcon icon={faArrowLeft} fixedWidth />{' '}
              Retour
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-4">
        <Card.Body className="py-3 d-flex justify-content-between align-items-start">
            <div>
                From my own experience, I can say that the return of functions from functions 
                causes the greatest difficulties for beginners. 
                And the point is not that the return is complicated in itself, 
                but that at first it is very difficult to understand why 
                this may be necessary. In real life, this technique is often used, 
                both in JS and in many other languages. Functions that accept functions 
                that return functions are common for any js code.
            </div>
        </Card.Body>
    </Card>

    </AdminLayout>
  )
}

export default Home
