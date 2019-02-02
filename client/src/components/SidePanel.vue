<template>
  <v-layout column>
    <div class="side-panel">
      <v-btn
        dark
        class="indigo darken-2 add-post-btn"
        @click="addPostHandler">
        Добавить пост
      </v-btn>
      <hr>
      <div v-for="tag in tags" :key="tag.name" class="tag-and-counter">
        <tag 
          :tagName="tag.name || tag">
        </tag>
        <span>{{tag.count}}</span>
      </div>
    </div>
  </v-layout>
</template>

<script>
import Tag from '@/components/Tag.vue'
import PostsService from '@/services/PostsService'

export default {
  data () {
    return {
      tags: []
    }
  },
  components: {
    Tag
  },
  methods: {
    addPostHandler: function () {
      if (this.$store.state.isUserLoggedIn) {
        this.$router.push({name: 'CreatePost'})
      } else {
        alert('Пожалуйста, войдите в аккаунт или зарегистрируйтесь')
      }
    }
  },
  async mounted () {
    try {
      const response = (await PostsService.getTags()).data
      this.tags = response.tags
    } catch (error) {
      console.log('error' + error)
    }
  }
}
</script>

<style scoped>
.add-post-btn {
  width: 100%;
  margin: 2px 2px 2px 2px;
}
.tag-and-counter {
  text-align: left;
}
.tag-and-counter * {
  display: inline-block;
}
</style>
