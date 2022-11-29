import { useSelector, useDispatch } from 'react-redux'
import {
  Form, Row, Col, Card, ListGroup, Button, Badge,
} from 'react-bootstrap'
import { ChtInstance } from '@prisma/client'
import { faBars, faComputer, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { setCurrentInstance } from '../../store/chtInstanceSlice'

const ChtInstancePicker = () => {
  const chtInstances = useSelector((state) => state.chtInstance.instances)
  const dispatch = useDispatch()
  const router = useRouter()

  const envBadges = {
    prod: 'danger',
    dev: 'info',
  }

  return (
    <div className="py-4">
      <h4 className="mb-4">
        Selectionnez une instance :
      </h4>

      <div className="my-3">
        <Link href="/cht-instances/create" passHref>
          <Button variant="primary">
            <FontAwesomeIcon icon={faPlus} />
            {' '}
            Ajouter une nouvelle instance
          </Button>
        </Link>
      </div>

      <Row xs={1} sm={2} md={2} lg={3} className="g-2">
        {chtInstances.map((instance: ChtInstance) => (
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
                  <Badge bg={envBadges[instance.env] ?? 'info'}>{instance.env}</Badge>
                </ListGroup.Item>
              </ListGroup>
              <Card.Body>
                <Button
                  variant="secondary"
                  onClick={() => {
                    dispatch(setCurrentInstance(instance.id))
                    router.push('/menu')
                  }}
                >
                  Sélectionner
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default ChtInstancePicker
