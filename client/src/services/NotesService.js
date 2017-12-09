import Api from '@/services/Api'

export default {
  post (note) { // добавление или обновление заметки
    return Api().post(`notes/save`, note)
  },
  delete (targetId) {
    return Api().get(`notes/delete/${targetId}`)
  }
}
