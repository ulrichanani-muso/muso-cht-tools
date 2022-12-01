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
    if (!messages.length) {
      return
    }

    const handler = ((toasts, version) => {
      const handleRouteChange = () => {
        toasts.map((m) => toast[m.type ?? 'info'](m.text))
        dispatch(clearMessages())
      }

      return handleRouteChange
    })(messages, +new Date())

    router.events.on('routeChangeComplete', handler)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeComplete', handler)
    }
  }, [messages])

  return children
}
