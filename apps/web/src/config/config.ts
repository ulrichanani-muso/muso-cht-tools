import chtInstances from './cht-instances.json'
import environmentTypes from './environmentTypes'

export const reducedEnvTypes: Object = environmentTypes.reduce((acc, i) => ({ ...acc, [i.code]: i }), {})
export const envColors: Object = environmentTypes.reduce((acc, i) => ({ ...acc, [i.code]: i.colorVariant }), {})
export const chtInstancesTemplates = chtInstances
export const apiUrl = process.env.NEXT_PUBLIC_API_URL
