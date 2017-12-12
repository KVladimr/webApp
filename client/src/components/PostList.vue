<template>
  <div>
    <v-layout column v-if="!error">
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
    <v-layout column v-else>
      <h3>{{error}}</h3>
    </v-layout>
  </div>
</template>

<script>
import Post from '@/components/Post.vue'
import PostsService from '@/services/PostsService'

export default {
  data () {
    return {
      error: null,
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
        params: { number: this.page },
        query: {tag: this.tag}
      })
    }
  },
  async mounted () {
    try {
      this.page = parseInt(this.$route.params.number) || 1
      this.tag = this.$route.query.tag
      const response = (await PostsService.showPage({page: this.page, tag: this.tag})).data
      this.posts = response.posts
      this.numPages = response.numPages
    } catch (error) {
      this.error = error.response.data.message
    }
  },
  async beforeRouteUpdate (to, from, next) {
    try {
      this.page = parseInt(to.params.number) || 1
      this.tag = to.query.tag
      const response = (await PostsService.showPage({page: this.page, tag: this.tag})).data
      this.posts = response.posts
      this.numPages = response.numPages
    } catch (error) {
      this.error = error.response.data.message
    }
    next()
  }
}
</script>

<style scoped>
.post_pagination {
  margin: 30px auto 0 auto;
}
</style>
