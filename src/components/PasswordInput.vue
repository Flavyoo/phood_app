<template>
  <div class="Input-group">
    <input
      v-model="value"
      type="password"
      v-bind:placeholder="placeholder"
      v-on:change="onInputChange"
      name="name"
      />
      <p class="Input-goup-error" v-if="notValid">
        {{ errorMessage }}
      </p>
    </div>
</template>

<script>
export default {
	name: 'PasswordInput',
	data () {
		return {
			value: '',
		}
	},
	props: {
        errorMessage: String,
		placeholder: String,
		name: String,
        notValid: Boolean,
	},
    methods: {
        onInputChange: function () {
            this.$emit('get-value', this.value);
        }
    }
}
</script>
