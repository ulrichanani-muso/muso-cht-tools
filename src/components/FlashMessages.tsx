import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { clearMessages } from 'src/store/flashMessagesSlice'

export default function FlashMessages({ children }) {
  const messages = useSelector((state) => state.flashMessages.messages)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    console.log('Flash hooking...')

    const handleRouteChange = (url, { shallow }) => {
      messages.map((m) => toast[m.type ?? 'info'](m.text))
      dispatch(clearMessages())
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [messages])

  return children
}
