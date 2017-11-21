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
        title: 'default title',
        text: ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        creator: 'some user name',
        creationDate: 'some date',
        image: 'https://pp.userapi.com/c840432/v840432848/6674/rLQiNkiUHck.jpg',
        tags: [
          'tag1', 'tag2', 'tag3', 'long tag4'
        ]
      }
    }
  },
  async mounted () {
    const postId = this.route.params.postId
    this.post = (await PostsService.show(postId)).data
  },
  components: {
    // Tag,
    Post
  }
}
</script>

<style scoped>
/* .post-info {
  
  text-align: left;
}
.post-image {
  width: 100%;
  border: 1px solid #ccc;
}
.post-image img {
  width: 100%;
  height: 100%;
}
.post-text {
  text-align: left;
} */
</style>
