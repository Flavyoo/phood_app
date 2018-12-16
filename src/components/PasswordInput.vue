<!--

A Password input component. This is different from the generic input
even though they share many of the same features.
However, this component can have its own validation along with error messages
when needed.

-->

<template>
  <div class="Input-group">
    <input class="Input-group-inputField"
      v-model="value"
      type="password"
      v-bind:placeholder="placeholder"
      v-on:change="onInputChange"
      name="name"
      />
      <p class="Input-group-error password-error" v-if="notValid">
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
            passwordErrorMessage: this.errorMessage
		}
	},
	props: {
        errorMessage: String,
		placeholder: String,
		name: String,
	},
    methods: {
        onInputChange: function () {
            this.$emit('get-value', this.value);
        },
        notValid: function() {
            if (this.passwordErrorMessage) {
                this.notValid = true
            } else {
                this.notValid = false
            }
        }
    }
}
</script>

<style scoped lang="scss">
.Input {
    &-group {
        margin: 20px;
        &-inputField {
            outline: none;
            border: none;
            border-bottom: 2px solid #9098A9;
            height: 2.4em;
            width: 86%;
            padding: 20px 0 20px 10px;
            font-size: 15px;
            font-weight: 500;
            line-height: 1.5;
            color: $LIGHT_TEAL_BLUE;
            &:hover {
                border-bottom-color: $PHOOD_BLUE;
            }
            &::placeholder {
                color: $LIGHT_TEAL_BLUE;
            }
        }
    }
}

</style>
