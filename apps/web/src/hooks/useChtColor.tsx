import { useSelector } from 'react-redux'
import { envColors } from 'src/config/config'

function useChtColor() {
  const currentChtInstance = useSelector((state) => state.chtInstance.current)

  if(!currentChtInstance) {
    return ['', '']
  }

  const variant = envColors[currentChtInstance.environment]

  return [variant, `bg-${variant}`]
}

export default useChtColor
