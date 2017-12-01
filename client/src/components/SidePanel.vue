<template>
  <v-layout column>
    <div class="side-panel">
      <v-btn
        dark
        class="indigo darken-2 add-post-btn"
        :to="{
          name: 'CreatePost'
        }">
        Добавить пост
      </v-btn>
    
    </div>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      testData: ['qwr', 'qwrerq', 'adsfdgf', 'zxcxbcb']
    }
  }
}
</script>

<style scoped>
.add-post-btn {
  width: 100%;
  margin: 2px 2px 2px 2px;
}
</style>
