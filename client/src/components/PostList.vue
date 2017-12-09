<template>
  <v-layout column>
    <post
      v-for="post in posts"
      :post="post"
      :key="post.post_id">
    </post>
    <v-pagination
      class="post_pagination"
      :length="numPages"
      v-model="page"
      :total-visible="7"
      circle
    ></v-pagination>
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
      tag: null,
      numPages: 1,
      posts: []
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
    this.page = parseInt(this.$route.params.number) || 1
    this.tag = this.$route.query.tag
    const response = (await PostsService.showPage({page: this.page, tag: this.tag})).data
    this.posts = response.posts
    this.numPages = response.numPages
  },
  async beforeRouteUpdate (to, from, next) {
    this.page = parseInt(to.params.number) || 1
    this.tag = to.query.tag
    const response = (await PostsService.showPage({page: this.page, tag: this.tag})).data
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
