import Link from 'next/link'
import { Nav } from 'react-bootstrap'
import ChtInstanceSelectInput from 'src/components/ChtInstance/ChtInstanceSelectInput'

export default function HeaderFeaturedNav() {
  return (
    <Nav>
      <Nav.Item>
        <ChtInstanceSelectInput />
      </Nav.Item>
    </Nav>
  )
}
