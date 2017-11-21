<template>
  <v-layout column>
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
  </v-layout>
</template>

<script>
import Tag from '@/components/Tag.vue'

export default {
  props: [
    'post'
  ],
  components: {
    Tag
  }
}
</script>

<style scoped>
.post-info {  
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
}
</style>
