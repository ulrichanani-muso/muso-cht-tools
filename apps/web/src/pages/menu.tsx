import type { NextPage } from 'next'
import { AdminLayout } from '@layout'
import React, { useEffect } from 'react'
import { Button, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBackspace, faPencil } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import useChtInstance from 'src/hooks/useChtInstance'

const Home: NextPage = () => {
  const currentChtInstance = useChtInstance()

  if (!currentChtInstance) {
    return <div />
  }

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between w-100">
        <h3 className="mb-4">Menu</h3>
      </div>

      <div className="row">
        <div className="col-sm-6 col-lg-4">
          <Link href="/contacts/renaming">
            <Card bg="primary" text="white" className="mb-4">
              <Card.Body className="pb-0 d-flex justify-content-between align-items-start">
                <div>
                  <div className="fs-4 fw-semibold d-flex">
                    <span className="fs-4 me-2 fw-normal mt-1">
                      <FontAwesomeIcon icon={faPencil} fixedWidth />
                    </span>
                    <div className="">Renommage de contacts</div>
                  </div>
                  <div className="mt-4 mb-3">Description...</div>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </div>
      </div>

    </AdminLayout>
  )
}

export default Home
