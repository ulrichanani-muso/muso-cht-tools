import { useSession } from 'next-auth/react'
import { PropsWithChildren } from 'react'
import Spinner from 'react-bootstrap/Spinner'

export default function Auth({ children }: PropsWithChildren) {
  const { status } = useSession({ required: true })

  if (status === 'loading') {
    return (
      <div className="w-100 h-100 mt-5 pt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading...</p>
      </div>
    )
  }

  return children
}
