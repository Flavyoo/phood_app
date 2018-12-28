import { shallowMount } from '@vue/test-utils'
import LoginForm from '@/components/LoginForm'

// Test that the password error shows when length is not valid.
describe('LoginForm', () => {
	const wrapper = shallowMount(LoginForm, {
		data: {
			signingUp: true,
			errorMessage: 'Something went wrong'
		}
	})

	expect(wrapper.find('.errorMessage').text()).toEqual('Something went wrong')
})
// test that the form changes when sign up is clicked -- check header
//     -- check account standing text
// check that when edit is clicked on an item card, the form is filled with
// the values of the item card object
