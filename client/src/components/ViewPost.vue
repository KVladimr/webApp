<template>
  <v-layout column>
    <post :post="post"/>
  </v-layout>
  <!-- <v-layout column>
    <div class="post-info">
      <h1>{{post.title}}</h1>
      <span>{{post.creator}}</span>
      <span>{{post.creationDate}}</span>
      <v-layout>
        <tag 
          v-for="tag in post.tags"
          :key="tag"
          :tagName="tag">
        </tag>
      </v-layout>
    </div>
    <div class="post-image">
      <div class="post-text">
        {{post.text}}
      </div>
      <img :src="post.image">
    </div>
  </v-layout> -->
</template>

<script>
import PostsService from '@/services/PostsService'
// import Tag from '@/components/Tag.vue'
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
        // creator: {
        //   user_id: null,
        //   name: null
        // },
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
    // обработка изменений параметров пути...
    // не забудьте вызывать next()
  },
  components: {
    // Tag,
    Post
  }
}
</script>

<style scoped>

</style>
