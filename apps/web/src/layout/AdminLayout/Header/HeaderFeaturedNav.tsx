import { Nav } from 'react-bootstrap'
import CurrentChtInstanceButton from 'src/components/ChtInstance/CurrentChtInstanceButton'

export default function HeaderFeaturedNav() {
  return (
    <Nav>
      <Nav.Item>
        <CurrentChtInstanceButton />
      </Nav.Item>
    </Nav>
  )
}
