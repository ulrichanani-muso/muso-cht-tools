import type { NextPage } from 'next'
import React from 'react'
import { Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faPencil } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import ChtAdminLayout from '@layout/AdminLayout/ChtAdminLayout'

const Home: NextPage = () => (
  <ChtAdminLayout>
    <div className="d-flex justify-content-between w-100">
      <h3 className="mb-4">Menu</h3>
    </div>

    <div className="row">
      <div className="col-sm-6 col-lg-4">
        <Link href="/contacts/rename">
          <Card bg="primary" text="white" className="mb-4">
            <Card.Body className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold d-flex">
                  <span className="fs-4 me-2 fw-normal mt-1">
                    <FontAwesomeIcon icon={faPencil} fixedWidth />
                  </span>
                  <div className="">Renommage de contacts</div>
                </div>
                <div className="mt-4 mb-3">Changer le nom d'un contact dans le CHT.</div>
              </div>
            </Card.Body>
          </Card>
        </Link>
      </div>
      <div className="col-sm-6 col-lg-4">
        <Link href="/contacts/move">
          <Card bg="primary" text="white" className="mb-4">
            <Card.Body className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold d-flex">
                  <span className="fs-4 me-2 fw-normal mt-1">
                    <FontAwesomeIcon icon={faArrowRightFromBracket} fixedWidth />
                  </span>
                  <div className="">Déplacement de contacts</div>
                </div>
                <div className="mt-4 mb-3">Déplacer un contact d'une zone à une autre.</div>
              </div>
            </Card.Body>
          </Card>
        </Link>
      </div>
    </div>
  </ChtAdminLayout>
)

export default Home
