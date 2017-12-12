import Api from '@/services/Api'

export default {
  show (userId) {
    return Api().get(`users/${userId}`)
  },
  put (user) {
    return Api().put(`users/update`, user)
  }
}
