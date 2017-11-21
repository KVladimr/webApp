<template>
  <v-layout column>
    <post
      v-for="post in posts"
      :post="post"
      :key="post.id">
    </post>
  </v-layout>
</template>

<script>
import Post from '@/components/Post.vue'

export default {
  data () {
    return {
      posts: [
        {
          title: 'default title',
          text: ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          creator: 'some user name',
          creationDate: 'some date',
          image: 'https://pp.userapi.com/c840432/v840432848/6674/rLQiNkiUHck.jpg',
          tags: [
            'tag1', 'tag2', 'tag3', 'long tag4'
          ]
        },
        {
          title: 'Дрожь земли',
          text: ' Любопытно было бы посмотреть на лица голливудских боссов, когда они впервые услышали синопсис проекта, впоследствии выросшего в цикл «Дрожь земли» – это история о захолустном городке, в котором завелись кровожадные подземные черви. Своего рода сухопутные «Челюсти», только с одним условием: если от акулы можно было сбежать, выбравшись на берег, то от местных монстров спасения нет. А, и еще – это не чистый хоррор, а комедия.',
          creator: 'another user name',
          creationDate: 'some date 2',
          image: 'https://cs8.pikabu.ru/post_img/2017/11/21/6/1511253255125562838.jpg',
          tags: [
            'tag1123', 'bigtag2', 'tag3', 'long tag4', 'exrta tag'
          ]
        }
      ]
    }
  },
  components: {
    Post
  }
}
</script>

<style scoped>

</style>
