import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import User from '@/components/User'
import ViewPost from '@/components/ViewPost'
import PostList from '@/components/PostList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PostList',
      component: PostList
    },
    {
      path: '/user/:id',
      name: 'User',
      component: User
    },
    {
      path: '/post/:id',
      name: 'ViewPost',
      component: ViewPost
    }
  ]
})
