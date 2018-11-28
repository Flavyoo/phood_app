<template>
  <div class="Login container">
    <div class="row">
      <div class="Login-formContainer">
        <LoginForm loginHeader="Welcome"/>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue'

export default {
    name: "LoginView",
    components: {
        LoginForm,
    },
}
</script>

<style scoped lang="scss">
.Login {
	&-formContainer {
		margin: 0 auto;
		min-width: 50%;
	}
}
</style>
