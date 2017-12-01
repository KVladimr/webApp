<template>
  <v-layout column>
    <post
      v-for="post in posts"
      :post="post"
      :key="post.post_id">
    </post>
    <v-pagination class="post_pagination" :length="numPages" v-model="page" :total-visible="7" circle></v-pagination>
  </v-layout>
</template>

<script>
import Post from '@/components/Post.vue'
import PostsService from '@/services/PostsService'

export default {
  data () {
    return {
      postsOnPage: 10,
      page: 1,
      numPages: 1,
      posts: [
        // {
        //   post_id: 1,
        //   title: 'default title',
        //   text: ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        //   creator: {
        //     id: 1,
        //     name: 'some user name'
        //   },
        //   creation_date: 'some date',
        //   image: 'https://pp.userapi.com/c840432/v840432848/6674/rLQiNkiUHck.jpg',
        //   tags: [
        //     'tag1', 'tag2', 'tag3', 'long tag4'
        //   ]
        // },
        // {
        //   post_id: 2,
        //   title: 'Дрожь земли',
        //   text: ' Любопытно было бы посмотреть на лица голливудских боссов, когда они впервые услышали синопсис проекта, впоследствии выросшего в цикл «Дрожь земли» – это история о захолустном городке, в котором завелись кровожадные подземные черви. Своего рода сухопутные «Челюсти», только с одним условием: если от акулы можно было сбежать, выбравшись на берег, то от местных монстров спасения нет. А, и еще – это не чистый хоррор, а комедия.',
        //   creator: {
        //     id: 2,
        //     name: 'second user name'
        //   },
        //   creation_date: 'some date 2',
        //   image: 'https://cs8.pikabu.ru/post_img/2017/11/21/6/1511253255125562838.jpg',
        //   tags: [
        //     'tag1123', 'bigtag2', 'tag3', 'long tag4', 'exrta tag'
        //   ]
        // },
        // {
        //   post_id: 3,
        //   title: 'бедный пост',
        //   text: 'Глубоким разочарованием для телеканала The Weather Channel закончился долгожданный снос стадиона Georgia Dome в Атланте (США). Съемочная группа установила свою камеру напротив спортивной арены, но прямо в момент грандиозного взрыва перед ней вздумал остановиться обычный рейсовый автобус.',
        //   creator: {
        //     id: 3,
        //     name: 'enek'
        //   },
        //   creation_date: '22.11.2017',
        //   tags: [
        //     'не везёт'
        //   ]
        // }
      ]
    }
  },
  components: {
    Post
  },
  watch: {
    page: function () {
      this.$router.push({
        name: 'PostList',
        params: { number: this.page }
      })
    }
  },
  async mounted () {
    // const pageId = this.$route.params.id
    this.page = parseInt(this.$route.params.number) || 1
    const response = (await PostsService.showPage(this.page)).data
    this.posts = response.posts
    this.numPages = response.numPages
    // this.page = response.page
    // this.posts = (await PostsService.showPage(this.page)).data.posts
  },
  async beforeRouteUpdate (to, from, next) {
    this.page = parseInt(to.params.number) || 1
    const response = (await PostsService.showPage(this.page)).data
    this.posts = response.posts
    this.numPages = response.numPages
    next()
  }
}
</script>

<style scoped>
.post_pagination {
  margin: 30px auto 0 auto;
}
</style>
