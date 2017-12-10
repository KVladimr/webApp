import Api from '@/services/Api'

export default {
  // index (search) {
  //   return Api().get('posts', {
  //     params: {
  //       search: search
  //     }
  //   })
  // },
  show (postId) {
    return Api().get(`posts/${postId}`)
  },
  post (post) {
    return Api().post('posts/new', post)
  },
  // put (post) {
  //   return Api().put(`posts/${post.id}`, post)
  // },
  showPage (page) {
    if (page.tag) {
      return Api().get(`page/${page.page}?tag=${page.tag}`)
    } else {
      return Api().get(`page/${page.page}`)
    }
  },
  getTags () {
    return Api().get(`tags/frequent`)
  }
}
