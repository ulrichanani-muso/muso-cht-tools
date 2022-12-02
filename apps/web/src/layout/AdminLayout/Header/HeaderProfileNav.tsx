import {
  Badge, Dropdown, Nav, NavItem,
} from 'react-bootstrap'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PropsWithChildren } from 'react'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faPowerOff,
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

type NavItemProps = {
  icon: IconDefinition;
} & PropsWithChildren

const ProfileDropdownItem = (props: NavItemProps) => {
  const { icon, children } = props

  return (
    <>
      <FontAwesomeIcon className="me-2" icon={icon} fixedWidth />
      {children}
    </>
  )
}

export default function HeaderProfileNav() {
  const { data: session } = useSession()

  return (
    <Nav>
      <Dropdown as={NavItem}>
        <Dropdown.Toggle variant="link" bsPrefix="shadow-none" className="py-0 px-2 rounded-0" id="dropdown-profile">
          <div className="avatar position-relative">
            <Image
              fill
              className="rounded-circle"
              src={session?.user?.image || ''}
              alt={session?.user?.email || ''}
            />
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className="pt-0">

          {/* <Dropdown.Header className="bg-light fw-bold">Settings</Dropdown.Header>
          <Link href="/" passHref legacyBehavior>
            <Dropdown.Item>
              <ProfileDropdownItem icon={faUser}>Profile</ProfileDropdownItem>
            </Dropdown.Item>
          </Link>
          <Link href="/" passHref legacyBehavior>
            <Dropdown.Item>
              <ProfileDropdownItem icon={faGear}>Settings</ProfileDropdownItem>
            </Dropdown.Item>
          </Link> */}

          <Dropdown.Divider />

          {/* <Link
            href="#"
            passHref
            legacyBehavior
            onClick={async (e) => {
              e.preventDefault()
              await signOut({ callbackUrl: '/<login>' })
            }}
          > */}
          <Link href="/api/auth/signout" passHref legacyBehavior>
            <Dropdown.Item>
              <ProfileDropdownItem icon={faPowerOff}>Se Déconnecter</ProfileDropdownItem>
            </Dropdown.Item>
          </Link>
        </Dropdown.Menu>
      </Dropdown>
    </Nav>
  )
}
