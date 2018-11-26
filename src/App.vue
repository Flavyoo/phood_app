<template>
  <div id="app">
    <Navbar/>
    <router-view/>
  </div>
</template>


<script>
import Navbar from '@/components/Navbar.vue'

export default {
  components: {
    Navbar
  },
  async created () {
    await this.refreshActiveUser()
  },
  watch: {
    // everytime a route is changed refresh the activeUser
    '$route': 'refreshActiveUser'
  },
  methods: {
    async refreshActiveUser () {
      const payload = {
          activeUser: await this.$auth.getUser()
      }
      this.$store.dispatch('saveUser', payload)
    },
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  width: 100%;
}
</style>
