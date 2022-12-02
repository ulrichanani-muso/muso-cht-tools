import { useSelector, useDispatch } from 'react-redux'
import {
  Row, Col, Card, ListGroup, Button, Badge, Form,
} from 'react-bootstrap'
import { ChtInstance } from '@prisma/client'
import { faComputer, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/router'
import environmentTypes from 'src/config/environmentTypes'
import { flash } from 'src/store/flashMessagesSlice'
import { setCurrentInstance } from '../../store/chtInstanceSlice'
import api from '../../helpers/api'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'

const ChtInstancesList = () => {
  const chtInstances = useSelector((state) => state.chtInstance.instances)
  const [search, setSearch] = useState('')
  const [filteredInstances, setFilteredInstances] = useState([])
  const router = useRouter()
  const dispatch = useDispatch()

  const envs = environmentTypes.reduce((acc, i) => ({ ...acc, [i.code]: i }), {})

  const deleteInstance = async (instance) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette isntance ?')) {
      return
    }

    try {
      await api.delete('/cht-instances/' + instance.id)
      toast('Instance supprimée')
      router.reload()
    } catch (error) {
      toast.error(`Une erreur s'est produite : \n${error?.message}`)
      console.error(error)
    }
  }

  useEffect(() => {
    setFilteredInstances(
      chtInstances.filter(i => {
          return !search ||
            i.name.toLowerCase()
              .search(search.toLowerCase()) >= 0
        })
    )
  }, [search])

  useEffect(() => {
    setFilteredInstances(chtInstances)
  }, [chtInstances])

  return (
    <div className="py-4">
      {/* <h4 className="mb-4">
        Selectionnez une instance :
      </h4> */}

      <div className="my-3 text-end">
        <Form.Control
            className='d-inline w-auto me-2'
            type="text"
            placeholder="Rechercher..."
            onChange={(e) => setSearch(e.target.value)}
          />
        <Link href="/cht-instances/create" passHref>
          <Button variant="primary">
            <FontAwesomeIcon icon={faPlus} />
            {' '}
            Ajouter une nouvelle instance
          </Button>
        </Link>
      </div>

      <Row xs={1} sm={2} md={2} lg={3} className="g-2">
        {filteredInstances.map((instance: ChtInstance) => (
          <Col key={instance.id}>
            <Card>
              <Card.Body>
                <Card.Title>
                  <FontAwesomeIcon icon={faComputer} />
                  {' '}
                  {instance.name}
                </Card.Title>
                <Card.Text>{instance.description}</Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>
                  <strong>URL :</strong>
                  {' '}
                  {instance.url}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Username :</strong>
                  {' '}
                  {instance.username}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Environement :</strong>
                  {' '}
                  <Badge bg={envs[instance.environment]?.colorVariant ?? 'info'}>
                    {envs[instance.environment]?.name}
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
              <Card.Body>
                <Button
                  variant="secondary"
                  onClick={() => {
                    dispatch(setCurrentInstance(instance.id))
                    dispatch(flash({ text: `Instance ${instance.name} selectionnée` }))
                    router.push('/menu')
                  }}
                >
                  Sélectionner
                </Button>
                <Button variant="danger" className="ms-1 px-3"
                onClick={() => deleteInstance(instance)}
                >
                    <FontAwesomeIcon icon={faTrash} />
              </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default ChtInstancesList
