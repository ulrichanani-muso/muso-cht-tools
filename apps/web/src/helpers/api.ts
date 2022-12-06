import axios from 'axios'
import config from '../config/config'
import { getCookieToken } from './auth'

const api = axios.create({
  baseURL: config.apiUrl,
  headers: { Authorization: `Bearer ${getCookieToken()}` },
})

export default api
