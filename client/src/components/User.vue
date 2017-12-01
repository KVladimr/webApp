<template>
<v-layout column>
  <div class="user-info">
    <div class="avatar11">
      <img :src="user.avatar">
    </div>
    <div class="user-info-text">
      <h1>{{user.name}}</h1>
      <p>Дата регистрации: {{user.regDate}}</p>
      <p>Постов: {{user.postsCount}}</p>
    </div>
  </div>
  <hr>
</v-layout>
</template>

<script>
import UsersService from '@/services/UsersService'

export default {
  data () {
    return {
      user: {
        name: null,
        regDate: 'пока не реализовано',
        postsCount: null,
        // avatar: null
        avatar: `../assets/logo.png`
      }
    }
  },
  async mounted () {
    const userId = this.$route.params.id
    this.user = (await UsersService.show(userId)).data
  },
  async beforeRouteUpdate (to, from, next) {
    const userId = to.params.id
    this.user = (await UsersService.show(userId)).data
    next()
  }
  // props: [
  //   'userName','regDate', 'numPosts'
  // ]
}
</script>

<style scoped>
.user-info {
  margin: 30px 15px 20px 15px;
  align-content: left;
}
.avatar11 {
  width: 170px;
  height: 170px;
  float: left;
  border-radius: 5px;
  background-color: white;
}
.avatar11 img {
  border: 1px solid black;
  width: 100%;
  height: 100%;
}
.user-info-text {
  text-align: left;
  margin-left: 185px;
}
</style>
