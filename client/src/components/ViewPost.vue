<template>
  <v-layout column>
    <post :post="post"/>
  </v-layout>
</template>

<script>
import PostsService from '@/services/PostsService'
import Post from '@/components/Post.vue'

export default {
  data () {
    return {
      post: {
        post_id: null,
        title: null,
        text: null,
        creator_id: null,
        creator_name: null,
        creation_date: null,
        image: null,
        tags: []
      }
    }
  },
  async mounted () {
    const postId = this.$route.params.id
    this.post = (await PostsService.show(postId)).data
  },
  async beforeRouteUpdate (to, from, next) {
    const postId = to.params.id
    this.post = (await PostsService.show(postId)).data
    next()
  },
  components: {
    Post
  }
}
</script>

<style scoped>

</style>
