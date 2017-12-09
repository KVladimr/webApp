import axios from 'axios'
import store from '@/store/store'

export default () => {
  return axios.create({
    baseURL: `https://dsqb10whce.execute-api.us-east-1.amazonaws.com/dev/`,
    headers: {
      Authorization: `${store.state.token}`
    }
  })
}
