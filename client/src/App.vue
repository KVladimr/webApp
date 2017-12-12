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
        <div>Footer</div>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import PageHeader from '@/components/Header.vue'
import SidePanel from '@/components/SidePanel.vue'

export default {
  name: 'app',
  components: {
    PageHeader,
    SidePanel
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
}
.wrapper {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  padding: 0 20px;
  min-height: 300px;
}
.content-wrapper {
  float: left;
  width: 100%;
}
.main-side-panel {
  position: relative;
  width: 300px;
  margin-left: -320px;
  float: right;
  overflow: hidden;
  min-height: 600px;
  border: 2px solid #eee;
}
.content {
  margin-right: 320px;
  clear: both;
  overflow: auto;
  min-height: 400px;
}
</style>
