<template>
<v-layout column>
  <div class="user-info">
    <div class="avatar11">
      <img src="../assets/logo.png">
    </div>
    <div class="user-info-text">
      <h1>{{user.userName}}</h1>
      <p>Дата регистрации: {{user.regDate}}</p>
      <p>Постов: {{user.numPosts}}</p>
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
        userName: 'default Name',
        regDate: 'test date',
        numPosts: 9000
      }
    }
  },
  async mounted () {
    const userId = this.route.params.userId
    this.user = (await UsersService.show(userId)).data
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
