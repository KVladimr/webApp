<template>
  <div class="text-xs-center">
    <v-chip class="tag" @click="func">{{tagName}}</v-chip>
  </div>
</template>

<script>
export default {
  props: [
    'tagName'
  ],
  methods: {
    func () {
      this.$router.push({
        path: '/',
        query: { tag: this.tagName }
      })
    }
  }
}
</script>

<style scoped>

</style>
