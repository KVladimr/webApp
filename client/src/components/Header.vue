<template>
  <div>
    <v-toolbar fixed class="indigo darken-2" dark>
      <v-toolbar-title class="mr-4">
        <router-link 
          class="home"
          tag="span"
          :to="{
            name: 'Home'
          }">
          MyWebApp
        </router-link>
      </v-toolbar-title>

      <v-toolbar-items>
        <v-btn 
          flat 
          dark>
          Browse
        </v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <v-toolbar-items v-if="!$store.state.isUserLoggedIn">
        <v-btn 
          @click="showLoginForm = true; showRegisterForm = false"
          flat 
          dark>
          Войти
        </v-btn>
        
        <v-btn 
          @click="showRegisterForm = true; showLoginForm = false"
          flat 
          dark>
          Регистрация
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-if="$store.state.isUserLoggedIn">
        <v-btn 
          flat 
          dark
          @click="logout">
          Выйти
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <register-form 
      v-if="showRegisterForm" 
      @close="showRegisterForm = false">
    </register-form>
    <login-form 
      v-if="showLoginForm" 
      @close="showLoginForm = false">
    </login-form>
  </div>
</template>

<script>
import RegisterForm from '@/components/RegisterForm.vue'
import LoginForm from '@/components/LoginForm.vue'

export default {
  data () {
    return {
      showRegisterForm: false,
      showLoginForm: false
    }
  },
  components: {
    RegisterForm,
    LoginForm
  },
  methods: {
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({
        name: 'Home'
      })
    }
  }
}
</script>

<style scoped>
.home {
  cursor: pointer;
}
.home:hover {
  color: #ccc;
}
</style>