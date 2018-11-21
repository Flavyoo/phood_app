<template>
  <div class="Navbar-wrapper">
    <div class="Navbar">
      <router-link to="/">
        <div class="Navbar-brandIcon">
          <p class="Navbar-brandIcon-header">Phood</p>
        </div>
      </router-link>
      <router-link class="Navbar-link Navbar-link-active" to="/">Home</router-link>
      <router-link class="Navbar-link" to="/product">Product</router-link>
      <router-link class="Navbar-link" to="/about">About</router-link>
      <router-link class="Navbar-link" to="/logout">Logout</router-link>
      <router-link class="Navbar-link" to="/contact">Contact</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style scoped lang="scss">
.Navbar {
    overflow: hidden;
    background-color: #192BC2;
    max-width: 2000px;
    margin: 0 auto;
}
.Navbar {
    &-wrapper {
        width: 100%;
        overflow: hidden;
        background-color: #192BC2;
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
