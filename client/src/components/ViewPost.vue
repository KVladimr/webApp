<template>
  <div>
    <v-layout column v-if="!error">
      <post :post="post"/>
    </v-layout>
    <v-layout column v-else>
      <h3>{{error}}</h3>
    </v-layout>
  </div>
</template>

<script>
import PostsService from '@/services/PostsService'
import Post from '@/components/Post.vue'

export default {
  data () {
    return {
      error: null,
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
    try {
      const postId = this.$route.params.id
      this.post = (await PostsService.show(postId)).data
      this.error = null
    } catch (error) {
      this.error = error.response.data.message
    }
  },
  async beforeRouteUpdate (to, from, next) {
    try {
      const postId = to.params.id
      this.post = (await PostsService.show(postId)).data
      this.error = null
    } catch (error) {
      this.error = error.response.data.message
    }
    next()
  },
  components: {
    Post
  }
}
</script>

<style scoped>

</style>
