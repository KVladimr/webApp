import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: `https://dsqb10whce.execute-api.us-east-1.amazonaws.com/dev/` // временно
    // baseURL: `http://localhost:8081/` // изменить URL
  })
}
