import type { NextPage } from 'next'
import { AdminLayout } from '@layout'
import React from 'react'
import { Card } from 'react-bootstrap'

const Home: NextPage = () => {

  return (
    <AdminLayout>
      <h3 className="mb-4">Renommage de contacts</h3>

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
