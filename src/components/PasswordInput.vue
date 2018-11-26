<!--

A Password input component. This is different from the generic input
even though they share many of the same features.
However, this component can have its own validation along with error messages
when needed.

-->

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
