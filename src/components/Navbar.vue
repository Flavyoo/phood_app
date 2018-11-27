<template>
  <div class="Navbar-wrapper">
    <div class="Navbar">
      <router-link to="/">
        <div class="Navbar-brandIcon">
          <p class="Navbar-brandIcon-header">Phood</p>
        </div>
      </router-link>
      <router-link v-if="authenticated"
                   class="Navbar-link"
                   to="/account">
                   {{ givenName }}
      </router-link>
      <router-link v-else class="Navbar-link" to="/account">
          Account
      </router-link>
      <router-link class="Navbar-link Navbar-link-active" to="/">Home</router-link>
      <router-link class="Navbar-link" to="/product">Product</router-link>
      <router-link class="Navbar-link" to="/about">About</router-link>
      <a href="#"
                  class="Navbar-link"
                  @click.prevent="logout"
                  v-if="authenticated">
                  Logout
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  created () {
    this.isAuthenticated()
  },
  watch: {
    // Everytime the route changes, check for auth status
    '$route': 'isAuthenticated'
  },
  computed: {
      authenticated() {
          return this.$store.getters.isAuthenticated
      },
      givenName() {
          return this.$store.getters.getGivenName
      }
  },
  methods: {
    async logout () {
      await this.$auth.logout()
      await this.isAuthenticated()
      this.$store.dispatch('logout')
      // Navigate back to home
      this.$router.push({ path: '/' })
     },
    async isAuthenticated () {
      const payload = {
          isLoggedIn: await this.$auth.isAuthenticated(),
      }
      this.$store.dispatch('authenticate', payload)
    },
  }
}
</script>

<style scoped lang="scss">
.Navbar {
    overflow: hidden;
    background-color: $PERSIAN_BLUE;
    max-width: 2000px;
    margin: 0 auto;
}
.Navbar {
    &-wrapper {
        width: 100%;
        overflow: hidden;
        background-color: $PERSIAN_BLUE;
        height: 80px;
    }
    &-brandIcon {
        display: block;
        width: auto;
        float: left;
        text-decoration: none;
        margin: 20px 0 0 20px;
    }
    &-brandIcon-header {
        color: white;
        font-size: 28px;
        font-weight: bold;
        letter-spacing: .8px;
        margin: 0;
    }
    &-link {
        text-decoration: none;
        float: left;
        display: block;
        padding: 5px 20px;
        margin-top: 25px;
        color: white;
        font-size: 16px;
        font-weight: bold;
        opacity: .6;
    }
    &-link:hover {
        opacity: .9

    }
}
</style>
