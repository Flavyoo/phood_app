<template>
  <div class="Input-group">
    <input class="Input-group-inputField"
      v-bind:placeholder="placeholder"
      v-on:change="onInputChange"
      v-model="value"
      type="inputType"
      name="name"
      />
      <span class="Input-group-border"/>
  </div>
</template>

<script>
export default {
	name: 'GenericInput',
	data () {
		return {
			value: ''
		}
	},
	props: {
		placeholder: String,
		name: String,
        inputType: String,
	},
    methods: {
        onInputChange: function () {
            this.$emit('get-value', this.value);
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
