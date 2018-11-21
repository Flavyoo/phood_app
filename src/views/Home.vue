<template>
  <div class="home">
    <p>Home Page</p>
    <GenericInput
      placeholder="username"
      name="username"
      v-on:get-value="onGetInputValue"
    />
    <PasswordInput
      placeholder="password"
      name="password"
      v-on:get-value="onGetPasswordValue"
      />
      <p>{{ username }}</p>
      <p>{{ password }}</p>
  </div>
</template>

<script>
import GenericInput from '@/components/Input.vue'
import PasswordInput from '@/components/PasswordInput.vue'

export default {
    name: "HomePage",
    components: {
        GenericInput,
        PasswordInput
    },
    data () {
        return {
            username: '',
            password: ''
        }
    },
    methods: {
        onGetInputValue: function (value) {
            this.username = value;
        },
        onGetPasswordValue: function (value) {
            this.password = value;
        }
    }

}
</script>
