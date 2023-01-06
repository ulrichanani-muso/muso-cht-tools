/* eslint-disable react/jsx-props-no-spreading */
import type { NextPage } from 'next'
import { AdminLayout } from '@layout'
import React, { useEffect, useRef, useState } from 'react'
import {
  Button, Card, Spinner, ProgressBar, Alert,
} from 'react-bootstrap'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import api from 'src/helpers/api'
import { downloadFile } from 'src/helpers/common'

const ContactMoving: NextPage = () => {
  const currentChtInstance = useSelector((state) => state.chtInstance.current)
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [checkedOnce, setCheckedOnce] = useState(false)
  const intervalId = useRef()

  const { jobId, instanceId } = router.query

  const downloadResults = async () => {
    const res = await api.get(`/move/contact/result/${instanceId}/${jobId}`, { responseType: 'arraybuffer' })

    downloadFile(res.data, `move-contacts-results-${jobId}.xlsx`)
  }

  const checkProgress = async () => {
    const res = await api.get(`/move/contact/${instanceId}/${jobId}`)
    setProgress(res.data.progress)

    if (!checkedOnce) {
      setCheckedOnce(true)
    }

    if (res.data.progress === 100 && intervalId.current) {
      clearInterval(intervalId.current)
    }
  }

  useEffect(() => {
    checkProgress()
    intervalId.current = setInterval(checkProgress, 2500)

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current)
      }
    }
  }, [jobId, instanceId])

  useEffect(() => {
    if (progress !== 100) {
      return
    }

    downloadResults()
  }, [progress])

  if (!currentChtInstance) {
    return <AdminLayout><p>Loading...</p></AdminLayout>
  }

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between w-100">
        <h3 className="mb-4">Statut de l'opération</h3>
        <div>
          <Link href="/menu">
            <Button className="px-3">
              <FontAwesomeIcon icon={faArrowLeft} fixedWidth />
              {' '}
              Retour
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-4">
        <Card.Body className="py-3">
          {!checkedOnce && (
          <div className="w-100 h-100 py-5 text-center">
            <Spinner animation="border" role="status" />
          </div>
          )}

          {(progress < 100 && checkedOnce) && (
          <div>
            <p>Opération en cours :</p>
            <ProgressBar now={progress} label={`${progress}%`} animated style={{ height: '20px' }} />
          </div>
          )}

          {progress === 100 && (
          <div>
            <Alert variant="success">
              Opération terminée !
            </Alert>
            <div>
              <Button onClick={downloadResults}>Télécharger le ficher de résultats</Button>
            </div>
          </div>
          )}
        </Card.Body>
      </Card>

    </AdminLayout>
  )
}

export default ContactMoving
