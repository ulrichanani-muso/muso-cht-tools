import HttpException from 'App/Exceptions/HttpException'

// o : object, p : path, d : default
export const get = (o, p, d?) => p.reduce((xs, x) => (xs && xs[x] ? xs[x] : d || undefined), o)

export const isString = (val) => typeof val === 'string' || val instanceof String

export const isInstanceOfSome = (typesList) => (tobeMatched) =>
  typesList.some((oneType) => tobeMatched instanceof oneType)

export const ucFirst = (str) => `${str[0].toUpperCase()}${str.substr(1)}`

export const snakeToCamel = (str) =>
  str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''))

export const snakeToPascal = (str) => ucFirst(snakeToCamel(str))

export const sanitizeObject = (theObj) => {
  let obj = JSON.parse(JSON.stringify(theObj))
  Object.keys(obj).forEach((key) => obj[key] == null && delete obj[key])

  return obj
}

export const uniqId = () => +new Date() + '_' + Math.random().toString(36).substr(2, 9)

export const randomStr = (length = 9) => Math.random().toString(36).substr(2, length)

export const paginationParams = (request, page = 1, perPage = 15) => [
  request.input('page', page),
  request.input('per_page', perPage),
]

export const flatten = (obj, roots: Array<string> = [], sep = '.') =>
  Object
    // find props of given object
    .keys(obj)
    // return an object by iterating props
    .reduce(
      (memo, prop) =>
        Object.assign(
          // create a new object
          {},
          // include previously returned object
          memo,
          Object.prototype.toString.call(obj[prop]) === '[object Object]'
            ? // keep working if value is an object
              flatten(obj[prop], roots.concat([prop]))
            : // include current prop and value and prefix prop with the roots
              { [roots.concat([prop]).join(sep)]: obj[prop] }
        ),
      {}
    )

export const reject = (message, code = undefined) => {
  throw new HttpException(message, 500, code)
}

export default {
  isInstanceOfSome,
  snakeToCamel,
  isString,
  sanitizeObject,
  get,
  uniqId,
  paginationParams,
  flatten,
  randomStr,
}
