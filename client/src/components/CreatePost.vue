<template>
  <v-layout column>
    <h1>Новый пост</h1>
    <v-text-field
      label="Заголовок"
      required
      :rules="[required]"
      v-model="post.title"
    ></v-text-field>

    <v-text-field
      label="URL изображения"
      v-model="post.image"
    ></v-text-field>

    <v-layout>
      <div class="text-xs-center" 
        v-for="tag in post.tags"
        :key="tag"
        @click="post.tags.splice(post.tags.indexOf(tag),1)">
        <v-chip>{{tag}}</v-chip>
      </div>
    </v-layout>

    <v-layout>
      <v-text-field
        placeholder="Новый тег"
        v-model="newtag"
      ></v-text-field>
      <v-btn
        @click="addtag">
        Добавить тег
      </v-btn>  
    </v-layout>

    <v-text-field
      label="Текст поста"
      required
      textarea
      :rules="[required]"
      v-model="post.text"
    ></v-text-field>

    <div class="danger-alert" v-if="error">
      {{error}}
    </div>

    <v-btn
      dark
      class="indigo darken-2"
      @click="create">
      Добавить
    </v-btn>
    
  </v-layout>
</template>

<script>
import PostsService from '@/services/PostsService'

export default {
  data () {
    return {
      post: {
        title: null,
        text: null,
        creator_id: null,
        image: null,
        tags: []
      },
      error: null,
      newtag: '',
      required: (value) => !!value || 'Обязательное поле.'
    }
  },
  methods: {
    async create () {
      this.error = null
      if (!this.$store.state.isUserLoggedIn) {
        this.error = 'Необходима авторизация'
        return
      }
      this.post.creator_id = this.$store.state.user.user_id
      const filledFields = Object
        .keys(this.post)
        .filter(key => !!this.post[key])
      if (filledFields.length < 4) {
        this.error = 'Не все поля заполнены'
        return
      }
      try {
        const response = await PostsService.post(this.post)
        this.$router.push({
          name: 'ViewPost',
          params: { id: response.data.post_id }
        }) // мб на этот пост лучше
      } catch (err) {
        console.log(err)
      }
    },
    addtag () {
      if (this.newtag.trim()) {
        this.post.tags[this.post.tags.length] = this.newtag
      }
      this.newtag = ''
    }
  }
}
</script>

<style>

</style>
