import Api from '@/services/Api'

export default {
  index (search) {
    return Api().get('posts', {
      params: {
        search: search
      }
    })
  },
  show (postId) {
    return Api().get(`posts/${postId}`)
  },
  post (post) {
    return Api().post('posts', post)
  },
  put (post) {
    return Api().put(`posts/${post.id}`, post)
  }
}
