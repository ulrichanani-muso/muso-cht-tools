import { useSelector } from 'react-redux'

function useChtInstance() {
  const currentChtInstance = useSelector((state) => state.chtInstance.current)
  const chtInstances = useSelector((state) => state.chtInstance.instances)

  return [currentChtInstance, chtInstances]
}

export default useChtInstance
