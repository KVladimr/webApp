import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import User from '@/components/User'
import ViewPost from '@/components/ViewPost'
import PostList from '@/components/PostList'
import CreatePost from '@/components/CreatePost'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
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
    },
    {
      path: '/new',
      name: 'CreatePost',
      component: CreatePost
    },
    {
      path: '/page/:number',
      name: 'PostList',
      component: PostList
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
