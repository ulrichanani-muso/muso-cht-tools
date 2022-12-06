/* eslint-disable react/jsx-props-no-spreading */
import type { NextPage } from 'next'
import { AdminLayout } from '@layout'
import React, { useRef, useState } from 'react'
import {
  Form, Button, Card, Spinner, Row, Col,
} from 'react-bootstrap'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { flash } from 'src/store/flashMessagesSlice'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import api from 'src/helpers/api'
import useChtInstance from 'src/hooks/useChtInstance'

const { Control: { Feedback } } = Form

const ContactRenaming: NextPage = () => {
  // const currentChtInstance = useSelector((state) => state.chtInstance.current)
  const currentChtInstance = useChtInstance()
  const [submiting, setSubmiting] = useState(false)
  const fileRef = useRef()

  const router = useRouter()
  const dispatch = useDispatch()

  if (!currentChtInstance) {
    return <div />
  }

  const validationSchema = Yup.object({
    description: Yup.string().required('Requis'),
    fileop: Yup.mixed().required('Requis'),
    // .test("fileSize", "Fichier trop volumineux", (value) => {
    //   console.log(value)
    //   if (!value?.length) return false // attachment is optional
    //   return true
    //   // return value[0].size <= 2000000
    // }),
  })

  const submitData = async (data) => {
    setSubmiting(true)
    try {
      const body = new FormData()
      body.append('description', data.description)
      body.append('fileop', fileRef.current.files[0])
      body.append('instanceId', currentChtInstance.id)

      await api.post('/cht-instances', body, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      dispatch(flash({ text: 'L\'opération a démarré !' }))
      await router.push('/')
    } catch (error) {
      console.error(error)
      toast.error(`Une erreur s'est produite : \n${error?.message}`)
    } finally {
      setSubmiting(false)
    }
  }

  const formik = useFormik({
    initialValues: {},
    validationSchema,
    onSubmit: (values) => {
      submitData(values)
    },
  })

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between w-100">
        <h3 className="mb-4">Renommage de contacts</h3>
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
          <Form onSubmit={formik.handleSubmit}>

            <Form.Group as={Row} className="mb-4" controlId="fileop">
              <Form.Label column sm="3" className="text-start text-sm-end">Ficher Excell :</Form.Label>
              <Col sm="9">
                <Form.Control
                  ref={fileRef}
                  type="file"
                  accept=".xls,.xlsx"
                  required
                  placeholder="Ficher Excell"
                  isInvalid={!!formik.errors?.fileop}
                  {...formik.getFieldProps('fileop')}
                />
                <Feedback type="invalid">{formik.errors?.fileop}</Feedback>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-4" controlId="description">
              <Form.Label column sm="3" className="text-start text-sm-end">Description :</Form.Label>
              <Col sm="9">
                <Form.Control
                  as="textarea"
                  rows="5"
                  type="text"
                  required
                  placeholder="Description..."
                  isInvalid={!!formik.errors?.description}
                  {...formik.getFieldProps('description')}
                />
                <Feedback type="invalid">{formik.errors?.description}</Feedback>
              </Col>
            </Form.Group>

            <Row>
              <Col sm={{ span: 9, offset: 3 }}>
                <Button variant="primary" type="submit" className="mt-3">
                  {submiting && <Spinner size="sm" animation="border" role="status" />}
                  {' '}
                  Démarrer
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

    </AdminLayout>
  )
}

export default ContactRenaming
