<template>
  <v-layout column>
    <div class="post-info">
      <router-link 
        class="ref title-ref"
        tag="h1"
        :to="{
          path: `/post/${post.post_id}`
        }">
        {{post.title}}
      </router-link>
      <router-link 
        class="ref creator-ref"
        tag="span"
        :to="{
          path: `/user/${post.creator_id}`
        }">
        {{post.creator_name}}
      </router-link>
      <span>{{post.creation_date}}</span>
      <v-layout>
        <tag 
          v-for="tag in post.tags"
          :key="tag.name"
          :tagName="tag.name || tag">
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
.ref {
  cursor: pointer;
}
.creator-ref:hover {
  color: blue;
}
.title-ref:hover {
  color: #666;
}
</style>
