<template>
  <div id="app">
    <v-app>
      <page-header class="main-header"/>
      <main>
        <div class="page">
          <div class="wrapper">
            <div class="content-wrapper">
              <router-view class="content"></router-view>
            </div>
            <side-panel class="main-side-panel"></side-panel>
          </div>
        </div>
      </main>
      <v-footer class="pa-3">
        <v-spacer></v-spacer>
        <div>какой-то текст</div>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import PageHeader from '@/components/Header.vue'
import SidePanel from '@/components/SidePanel.vue'
// import RegisterForm from '@/components/RegisterForm.vue'

export default {
  // data () {
  //   return {
  //     showRegisterForm: false
  //   }
  // },
  name: 'app',
  components: {
    PageHeader,
    SidePanel
    // RegisterForm
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.main-header {
  z-index: 100;
}
.danger-alert {
  color: red;
}
.page {
  margin: 20px 0;
  width: 100%;
  /* background-color: pink; */
}
.wrapper {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  padding: 0 20px;
  min-height: 600px;
  /* background-color: green; */
}
.content-wrapper {
  float: left;
  width: 100%;
  /* background-color: red; */
}
.main-side-panel {
  position: relative;
  width: 300px;
  margin-left: -320px;
  float: right;
  overflow: hidden;
  min-height: 600px;
  border: 2px solid #777;
  /* background-color: yellow; */
}
.content {
  margin-right: 320px;
  clear: both;
  overflow: auto;
  min-height: 400px;
  /* background-color: blueviolet; */
}
</style>
