<template>
  <div class="Input-group">
    <input
      v-bind:placeholder="placeholder"
      v-on:change="onInputChange"
      v-model="value"
      type="text"
      name="name"
      />
	<p></p>
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
	},
    methods: {
        onInputChange: function () {
            this.$emit('get-value', this.value);
        }
    }
}
</script>
