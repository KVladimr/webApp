<template>
  <v-layout column>
    <div class="user-info">
      <div class="avatar11">
        <img :src="avatarComp">
      </div>
      <div class="user-info-text">
        <h1>{{user.name}}</h1>
        <p>Дата регистрации: {{user.creation_date}}</p>
        <p>Постов: {{user.postsCount}}</p>
      </div>
    </div>
    <div class="testt">
      <v-dialog v-model="dialog" persistent max-width="700px">
        <v-btn
          v-if="$store.state.user.user_id == $route.params.id"
          class="add-note-button"
          color="indigo darken-2"
          slot="activator"
          dark
          small>
          Редактировать
        </v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">Редактировать</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field v-model="tempAvatarURL" label="URL изображения"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="indigo darken-2" dark @click.native="saveInformation">Сохранить</v-btn>
            <v-btn color="indigo darken-2" dark @click.native="dialog = false; tempAvatarURL = user.avatar">Отмена</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <hr>
    <note
      v-if="$store.state.isUserLoggedIn && $store.state.user.user_id != $route.params.id"
      :note="note"
    ></note>
  </v-layout>
</template>

<script>
import UsersService from '@/services/UsersService'
import Note from '@/components/Note.vue'

export default {
  data () {
    return {
      dialog: false,
      tempAvatarURL: null,
      note: {
        notetext: ''
      },
      user: {
        name: null,
        creation_date: '',
        postsCount: null,
        avatar: null
        // avatar: `../assets/logo.png`
      }
    }
  },
  computed: {
    avatarComp: function () {
      return this.user.avatar ? this.user.avatar : 'https://ru.vuejs.org/images/logo.png'
    }
  },
  methods: {
    saveInformation: async function () {
      try {
        const response = (await UsersService.put({
          avatar: this.tempAvatarURL
        })).data
        console.log('message' + response.message)
        this.user.avatar = this.tempAvatarURL
        this.dialog = false
      } catch (error) {
        console.log('error' + error)
      }
    }
  },
  async mounted () {
    this.note = {notetext: ''}
    const userId = this.$route.params.id
    const response = (await UsersService.show(userId)).data
    this.user = response.user
    this.tempAvatarURL = this.user.avatar
    if (response.note) {
      this.note = response.note
    }
  },
  async beforeRouteUpdate (to, from, next) {
    this.note = {notetext: ''}
    const userId = to.params.id
    const response = (await UsersService.show(userId)).data
    this.user = response.user
    this.tempAvatarURL = this.user.avatar
    if (response.note) {
      this.note = response.note
    }
    next()
  },
  components: {
    Note
  }
}
</script>

<style scoped>
.user-info {
  margin: 30px 15px 10px 15px;
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
.add-note-button {
  width: 170px;
  margin: 0 0 10px 15px;
  display: inline-block;
}
.testt {
  text-align: left;
}
</style>
